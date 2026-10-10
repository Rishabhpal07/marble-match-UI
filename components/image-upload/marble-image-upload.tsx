"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  evaluationSamples,
  getEvaluationSample,
  type EvaluationSample,
} from "@/lib/evaluation-samples";
import { cn } from "@/lib/utils";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;

type SelectedImage = {
  file: File;
  previewUrl: string;
};

type CapturedImage = {
  file: File;
  previewUrl: string;
};

type PlaceholderMatchResult = EvaluationSample & {
  matchScore: number;
};

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File) {
  if (!acceptedTypes.includes(file.type)) {
    return "Choose a JPEG, PNG or WebP image.";
  }

  if (file.size > maxFileSize) {
    return "Choose an image smaller than 10 MB.";
  }

  return null;
}

function generatePlaceholderMatchResults(): PlaceholderMatchResult[] {
  // These placeholder percentages are random, not computed until a real matching engine is connected.
  return evaluationSamples.slice(0, 4).map((sample) => ({
    ...sample,
    matchScore: Math.floor(Math.random() * 49) + 51,
  }));
}

export function MarbleImageUpload({
  onImageSelected,
  showMatchingResults = true,
}: {
  onImageSelected?: (file: File) => Promise<void>;
  showMatchingResults?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analyzeTimeoutRef = useRef<number | null>(null);
  const selectedImagePreviewRef = useRef<string | null>(null);
  const isSamplePreloadActiveRef = useRef(true);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(
    null
  );
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isSavingSample, setIsSavingSample] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PlaceholderMatchResult[]>([]);

  useEffect(() => {
    return () => {
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage?.previewUrl]);

  useEffect(() => {
    return () => {
      if (capturedImage?.previewUrl) {
        URL.revokeObjectURL(capturedImage.previewUrl);
      }
    };
  }, [capturedImage?.previewUrl]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function clearInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const clearCapturedImage = useCallback(() => {
    setCapturedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setIsCameraStarting(false);
  }, []);

  const selectFile = useCallback((file: File | undefined, isSample = false) => {
    if (!file) {
      return;
    }

    if (!isSample) {
      isSamplePreloadActiveRef.current = false;
    }

    if (analyzeTimeoutRef.current) {
      window.clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = null;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setUploadMessage("");
      selectedImagePreviewRef.current = null;
      setSelectedImage((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return null;
      });
      setShowResults(false);
      setResults([]);
      setIsAnalyzing(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    selectedImagePreviewRef.current = previewUrl;

    setError("");
    setUploadMessage("");
    setIsSavingSample(false);
    setCameraError("");
    setShowResults(false);
    setResults([]);
    setIsAnalyzing(false);
    stopCamera();
    setSelectedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return {
        file,
        previewUrl,
      };
    });
    clearCapturedImage();
  }, [clearCapturedImage, stopCamera]);

  useEffect(() => {
    const requestedSample = getEvaluationSample(
      new URLSearchParams(window.location.search).get("sample")
    );

    if (!requestedSample) {
      return;
    }

    let isCurrent = true;

    async function loadSample(sample: EvaluationSample) {
      try {
        const response = await fetch(sample.src);

        if (!response.ok) {
          throw new Error(`Image request failed with status ${response.status}`);
        }

        const blob = await response.blob();

        if (!isCurrent || !isSamplePreloadActiveRef.current) {
          return;
        }

        selectFile(
          new File([blob], sample.filename, { type: "image/jpeg" }),
          true
        );
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname
        );
      } catch {
        if (isCurrent && isSamplePreloadActiveRef.current) {
          setError(
            "The selected evaluation sample could not be loaded. Please try selecting it again."
          );
        }
      }
    }

    void loadSample(requestedSample);

    return () => {
      isCurrent = false;
    };
  }, [selectFile]);

  useEffect(() => {
    return () => {
      if (analyzeTimeoutRef.current) {
        window.clearTimeout(analyzeTimeoutRef.current);
      }

      stopCamera();
    };
  }, [stopCamera]);

  function removeSelectedImage() {
    if (analyzeTimeoutRef.current) {
      window.clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = null;
    }

    selectedImagePreviewRef.current = null;
    setSelectedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
    setError("");
    setUploadMessage("");
    setIsSavingSample(false);
    setShowResults(false);
    setResults([]);
    setIsAnalyzing(false);
    clearInputValue();
  }

  async function handleUploadSelectedSample() {
    if (!selectedImage || !onImageSelected || isSavingSample) {
      return;
    }

    const previewUrl = selectedImage.previewUrl;
    setError("");
    setUploadMessage("");
    setIsSavingSample(true);

    try {
      await onImageSelected(selectedImage.file);

      if (selectedImagePreviewRef.current === previewUrl) {
        selectedImagePreviewRef.current = null;
        setSelectedImage(null);
        clearInputValue();
        setUploadMessage("Image added to your marble samples.");
      }
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this image to your marble samples."
      );
    } finally {
      setIsSavingSample(false);
    }
  }

  function handleContinue() {
    if (!selectedImage) {
      setError("No image selected yet. Choose a photo to continue.");
      return;
    }

    if (!showMatchingResults) {
      setError("");
      return;
    }

    if (analyzeTimeoutRef.current) {
      window.clearTimeout(analyzeTimeoutRef.current);
    }

    setError("");
    setIsAnalyzing(true);
    setShowResults(false);
    const pendingResults = generatePlaceholderMatchResults();

    analyzeTimeoutRef.current = window.setTimeout(() => {
      setResults(pendingResults);
      setIsAnalyzing(false);
      setShowResults(true);
      analyzeTimeoutRef.current = null;
    }, 700);
  }

  function handleChooseAnotherImage() {
    if (analyzeTimeoutRef.current) {
      window.clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = null;
    }

    setShowResults(false);
    setResults([]);
    setIsAnalyzing(false);
    removeSelectedImage();
  }

  async function openCamera() {
    setCameraError("");
    setError("");
    clearCapturedImage();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera capture is not supported in this browser. Use image upload instead."
      );
      return;
    }

    try {
      setIsCameraStarting(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (cameraAccessError) {
      const message =
        cameraAccessError instanceof DOMException &&
        cameraAccessError.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access or use image upload instead."
          : "Camera is unavailable. Check your device or use image upload instead.";

      setCameraError(message);
      stopCamera();
    } finally {
      setIsCameraStarting(false);
    }
  }

  function closeCamera() {
    stopCamera();
    setCameraError("");
  }

  async function capturePhoto() {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("Camera preview is not ready yet. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture from this camera preview.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setCameraError("Unable to create an image from the captured frame.");
      return;
    }

    const file = new File([blob], `marble-capture-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    const validationError = validateFile(file);

    if (validationError) {
      setCameraError(validationError);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setCameraError("");
    setCapturedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return {
        file,
        previewUrl,
      };
    });
    stopCamera();
  }

  function retakePhoto() {
    clearCapturedImage();
    void openCamera();
  }

  function acceptCapturedPhoto() {
    if (!capturedImage) {
      return;
    }

    selectFile(capturedImage.file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => event.preventDefault()}
      aria-describedby="upload-help upload-error"
    >
      <Card className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
              Image preview
            </Badge>
            <span className="text-sm text-zinc-500">
              Choose an image to review the available samples.
            </span>
          </div>
          <CardTitle className="text-2xl font-semibold text-zinc-950">
            Upload a marble image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={inputRef}
            id="marble-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleInputChange}
          />

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={openFilePicker}>
              <ImagePlus aria-hidden="true" />
              Upload Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openCamera}
              disabled={isCameraStarting || isCameraOpen}
            >
              <Camera aria-hidden="true" />
              {isCameraStarting ? "Opening Camera..." : "Take Photo"}
            </Button>
          </div>

          {cameraError ? (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {cameraError}
            </div>
          ) : null}

          {isCameraOpen ? (
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-950 p-4 shadow-sm">
              <div className="overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="aspect-[16/10] w-full object-cover"
                  aria-label="Live camera preview"
                />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white"
                  onClick={closeCamera}
                  aria-label="Close camera preview"
                >
                  <X aria-hidden="true" />
                  Close Camera
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  aria-label="Capture photo from camera"
                >
                  <Camera aria-hidden="true" />
                  Capture Photo
                </Button>
              </div>
            </div>
          ) : null}

          {capturedImage ? (
            <div className="mb-4 grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <Image
                  src={capturedImage.previewUrl}
                  alt="Captured marble preview"
                  width={960}
                  height={640}
                  unoptimized
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4">
                <div>
                  <p className="text-sm font-medium text-zinc-950">
                    Captured photo ready
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {capturedImage.file.type} ·{" "}
                    {formatBytes(capturedImage.file.size)}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    Review this frame before using it for the local preview.
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Button type="button" variant="outline" onClick={retakePhoto}>
                    <RefreshCw aria-hidden="true" />
                    Retake Photo
                  </Button>
                  <Button type="button" onClick={acceptCapturedPhoto}>
                    <Camera aria-hidden="true" />
                    Accept Photo
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400",
              isDragging && "border-zinc-950 bg-white"
            )}
          >
            {selectedImage ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  <Image
                    src={selectedImage.previewUrl}
                    alt="Selected marble preview"
                    width={960}
                    height={640}
                    unoptimized
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-950">
                      {selectedImage.file.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {selectedImage.file.type} ·{" "}
                      {formatBytes(selectedImage.file.size)}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-600">
                      {onImageSelected && !showMatchingResults
                        ? "Upload this image to add it to your marble samples."
                        : "Ready to review the available sample images."}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        openFilePicker();
                      }}
                    >
                      <RefreshCw aria-hidden="true" />
                      Replace image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelectedImage();
                      }}
                    >
                      <Trash2 aria-hidden="true" />
                      Remove image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                  <UploadCloud className="size-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-zinc-950">
                  Drop a marble photo here
                </h2>
                <p
                  id="upload-help"
                  className="mt-2 max-w-md text-sm leading-6 text-zinc-600"
                >
                  Drag and drop an image, click upload, or use the camera.
                  JPEG, PNG and WebP files up to 10 MB are accepted.
                </p>
                <Button type="button" className="mt-5" onClick={openFilePicker}>
                  <ImagePlus aria-hidden="true" />
                  Select image
                </Button>
              </div>
            )}
          </div>

          <p
            id="upload-error"
            className="mt-3 min-h-5 text-sm font-medium text-red-600"
            aria-live="polite"
          >
            {error}
          </p>
          {uploadMessage ? (
            <p
              className="mt-1 text-sm font-medium text-emerald-700"
              role="status"
              aria-live="polite"
            >
              {uploadMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {showMatchingResults && (showResults || isAnalyzing) ? (
        <Card className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-zinc-950">
              Matching results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAnalyzing ? (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-sm">
                  <Sparkles className="size-5 animate-pulse" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-950">
                  Preparing sample comparisons
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-600">
                  Comparing the selected image with available samples.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                <h3 className="text-lg font-semibold text-zinc-950">
                  No sample images available
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Choose an image to review available company samples.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                    {selectedImage ? (
                      <Image
                        src={selectedImage.previewUrl}
                        alt="Selected marble preview for matching results"
                        width={960}
                        height={640}
                        unoptimized
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                        Query image
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-zinc-950">
                        Candidate shortlist
                      </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-zinc-200 bg-white p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                          Reference set
                        </p>
                        <p className="mt-2 text-sm font-medium text-zinc-950">
                          Company evaluation images
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-white p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                          Matching mode
                        </p>
                        <p className="mt-2 text-sm font-medium text-zinc-950">
                          Sample comparisons
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {results.map((candidate) => (
                    <article
                      key={candidate.filename}
                      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                    >
                      <div className="relative aspect-[16/10] border-b border-zinc-200 bg-zinc-100">
                        <Image
                          src={candidate.src}
                          alt={`Company evaluation sample ${candidate.filename}`}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="truncate font-semibold text-zinc-950">
                              Sample {candidate.imageId}
                            </h4>
                            <p className="mt-1 text-sm text-zinc-500">
                              {candidate.referenceId}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-zinc-300">
                            Dataset label: {candidate.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-zinc-100">
                            {candidate.condition.replaceAll("_", " ")}
                          </Badge>
                        </div>
                        <p className="break-all text-xs text-zinc-500">
                          {candidate.filename}
                        </p>

                        <div className="space-y-2 rounded-lg bg-zinc-50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-zinc-700">
                              Match score
                            </p>
                            <p className="text-sm font-semibold tabular-nums text-zinc-950">
                              {candidate.matchScore}%
                            </p>
                          </div>
                          <div
                            role="meter"
                            aria-label={`Match score for ${candidate.imageId}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={candidate.matchScore}
                            className="h-2 overflow-hidden rounded-full bg-zinc-200"
                          >
                            <div
                              className="h-full rounded-full bg-zinc-800 transition-[width] duration-500"
                              style={{ width: `${candidate.matchScore}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <Link
                            href="/samples"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400"
                          >
                            Explore samples
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                          <span className="text-xs text-zinc-500">
                            {candidate.referenceId} ·{" "}
                            {candidate.condition.replaceAll("_", " ")}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          {selectedImage
            ? showMatchingResults
              ? "Continue to review the available sample comparisons."
              : "Image selected. Upload it to add it to your marble samples."
            : "Choose or capture an image to add it to your marble samples."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {showMatchingResults && showResults ? (
            <Button type="button" variant="outline" onClick={handleChooseAnotherImage}>
              <RefreshCw aria-hidden="true" />
              Choose another image
            </Button>
          ) : null}
          {showMatchingResults ? (
            <Button
              type="button"
              disabled={!selectedImage || isAnalyzing}
              onClick={handleContinue}
            >
              {isAnalyzing ? "Reviewing..." : "Continue"}
              <UploadCloud aria-hidden="true" />
            </Button>
          ) : onImageSelected ? (
            <Button
              type="button"
              disabled={!selectedImage || isSavingSample}
              onClick={handleUploadSelectedSample}
            >
              {isSavingSample ? "Uploading..." : "Upload to samples"}
              <UploadCloud aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
