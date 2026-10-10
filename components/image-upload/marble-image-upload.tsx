"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage?.previewUrl]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function clearInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
    setSelectedImage((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return {
        file,
        previewUrl,
      };
    });
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
                  Drag and drop an image, or click to browse your computer.
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
