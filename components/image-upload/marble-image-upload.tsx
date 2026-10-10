"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function MarbleImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(
    null
  );
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function clearInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function clearCapturedImage() {
    setCapturedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setIsCameraStarting(false);
  }

  function selectFile(file: File | undefined) {
    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedImage((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return null;
      });
      clearInputValue();
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setError("");
    setCameraError("");
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
  }

  function removeSelectedImage() {
    setSelectedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
    setError("");
    clearInputValue();
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
              Local Preview Only
            </Badge>
            <span className="text-sm text-zinc-500">
              No upload or matching is performed yet.
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
                      Preview generated locally in your browser. Matching will
                      be added in a later task.
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
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          Continue becomes available after a valid local image is selected.
        </p>
        <Button type="button" disabled={!selectedImage}>
          Continue
          <UploadCloud aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
