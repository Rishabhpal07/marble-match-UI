"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  demoMarbles,
  marbleColors,
  marbleTypes,
  type DemoMarble,
} from "@/lib/demo-marbles";
import { evaluationSamples } from "@/lib/evaluation-samples";
import { MarbleImageUpload } from "@/components/image-upload/marble-image-upload";
import {
  getUserMarbleSamples,
  saveUserMarbleSample,
  type UserMarbleSample,
} from "@/lib/user-marble-samples";

type SavedMarbleSample = UserMarbleSample & {
  previewUrl: string;
};

function matchesSearch(marble: DemoMarble, search: string) {
  const value = search.trim().toLowerCase();

  if (!value) {
    return true;
  }

  return (
    marble.name.toLowerCase().includes(value) ||
    marble.id.toLowerCase().includes(value)
  );
}

export function MarbleCatalogue() {
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("all");
  const [type, setType] = useState("all");
  const [uploadedSamples, setUploadedSamples] = useState<SavedMarbleSample[]>(
    []
  );
  const [sampleStorageError, setSampleStorageError] = useState("");
  const samplePreviewUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    let isCurrent = true;
    const previewUrls = samplePreviewUrlsRef.current;

    void getUserMarbleSamples()
      .then((samples) => {
        const savedSamples = samples.map((sample) => ({
          ...sample,
          previewUrl: URL.createObjectURL(sample.image),
        }));

        if (!isCurrent) {
          savedSamples.forEach((sample) =>
            URL.revokeObjectURL(sample.previewUrl)
          );
          return;
        }

        savedSamples.forEach((sample) => previewUrls.add(sample.previewUrl));
        setUploadedSamples((current) => {
          const loadedIds = new Set(savedSamples.map((sample) => sample.id));
          return [
            ...current.filter((sample) => !loadedIds.has(sample.id)),
            ...savedSamples,
          ];
        });
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setSampleStorageError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your saved marble samples."
          );
        }
      });

    return () => {
      isCurrent = false;
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      previewUrls.clear();
    };
  }, []);

  const addUploadedSample = useCallback(async (file: File) => {
    const sample = await saveUserMarbleSample(file);
    const previewUrl = URL.createObjectURL(sample.image);
    samplePreviewUrlsRef.current.add(previewUrl);
    setSampleStorageError("");
    setUploadedSamples((current) => [
      { ...sample, previewUrl },
      ...current.filter((existing) => existing.id !== sample.id),
    ]);
  }, []);

  const filteredMarbles = useMemo(() => {
    return demoMarbles.filter((marble) => {
      const colorMatches = color === "all" || marble.color === color;
      const typeMatches = type === "all" || marble.type === type;

      return colorMatches && typeMatches && matchesSearch(marble, search);
    });
  }, [color, search, type]);

  const hasActiveFilters = search !== "" || color !== "all" || type !== "all";

  function clearFilters() {
    setSearch("");
    setColor("all");
    setType("all");
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
            Demo Catalogue
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
            Marble Catalogue
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Browse demonstration marble records for layout review. These
            examples are sample data until the company catalogue is provided.
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white">
          {filteredMarbles.length} of {demoMarbles.length} results
        </div>
      </section>

      <Card className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0">
        <CardHeader className="gap-3">
          <CardTitle className="flex items-center gap-2 text-base text-zinc-950">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Search and filters
          </CardTitle>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              aria-label="Clear marble catalogue filters"
            >
              <X aria-hidden="true" />
              Clear
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div>
              <label
                htmlFor="marble-search"
                className="text-sm font-medium text-zinc-700"
              >
                Search
              </label>
              <div className="relative mt-2">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <Input
                  id="marble-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by marble name or demo ID..."
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 shadow-none focus-visible:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="marble-color"
                className="text-sm font-medium text-zinc-700"
              >
                Color
              </label>
              <select
                id="marble-color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-3 focus:ring-zinc-300/50"
              >
                <option value="all">All colors</option>
                {marbleColors.map((marbleColor) => (
                  <option key={marbleColor} value={marbleColor}>
                    {marbleColor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="marble-type"
                className="text-sm font-medium text-zinc-700"
              >
                Type
              </label>
              <select
                id="marble-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-3 focus:ring-zinc-300/50"
              >
                <option value="all">All types</option>
                {marbleTypes.map((marbleType) => (
                  <option key={marbleType} value={marbleType}>
                    {marbleType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredMarbles.length > 0 ? (
        <section
          aria-label="Demo marble catalogue results"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredMarbles.map((marble) => (
            <article
              key={marble.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <Image
                src={marble.image}
                alt={`${marble.name} demo marble texture`}
                width={640}
                height={420}
                unoptimized
                className="h-48 w-full border-b border-zinc-200 object-cover"
              />
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-zinc-950">
                      {marble.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{marble.id}</p>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-100">
                    Demo
                  </Badge>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-zinc-500">Color</dt>
                    <dd className="mt-1 font-medium text-zinc-950">
                      {marble.color}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Finish</dt>
                    <dd className="mt-1 font-medium text-zinc-950">
                      {marble.finish}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Type</dt>
                    <dd className="mt-1 font-medium text-zinc-950">
                      {marble.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Origin</dt>
                    <dd className="mt-1 truncate font-medium text-zinc-950">
                      {marble.origin}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/marbles/${marble.id}`}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  View Details
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <Search className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-950">
            No demo marbles found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Adjust the search term or filters to see more demonstration
            catalogue records.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </section>
      )}

      <section aria-labelledby="catalogue-image-upload" className="space-y-4">
        <div>
          <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
            Image identification
          </Badge>
          <h2
            id="catalogue-image-upload"
            className="mt-3 text-lg font-semibold text-zinc-950"
          >
            Upload or capture a marble image
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Use an image from your device or capture one with your camera.
            Accepted images are saved as samples in this browser.
          </p>
        </div>
        <MarbleImageUpload
          onImageSelected={addUploadedSample}
          showMatchingResults={false}
        />
      </section>

      <section aria-labelledby="company-evaluation-images" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
              Marble sample library
            </Badge>
            <h2
              id="company-evaluation-images"
              className="mt-3 text-lg font-semibold text-zinc-950"
            >
              Marble evaluation samples
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Uploaded images are saved locally in this browser. Company
              evaluation labels are dataset ground truth, not matching results.
            </p>
          </div>
          <Link
            href="/samples"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-200 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Browse all {evaluationSamples.length} samples
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {sampleStorageError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {sampleStorageError}
          </p>
        ) : null}

        {uploadedSamples.length > 0 ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-950">
                Your uploaded marble samples
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Saved in this browser and visible only on this device.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {uploadedSamples.map((sample) => (
                <article
                  key={sample.id}
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-16/10 border-b border-zinc-200 bg-zinc-100">
                    <Image
                      src={sample.previewUrl}
                      alt={`Uploaded marble sample ${sample.filename}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="min-w-0">
                      <h4 className="font-medium text-zinc-950">
                        {sample.filename}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500">
                        Uploaded marble sample
                      </p>
                    </div>
                    <Badge variant="outline" className="border-zinc-300">
                      Your sample
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {uploadedSamples.length > 0 ? (
            <h3 className="text-base font-semibold text-zinc-950">
              Company evaluation samples
            </h3>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {evaluationSamples.slice(0, 6).map((sample) => (
              <article
                key={sample.filename}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative h-48 border-b border-zinc-200 bg-zinc-100">
                  <Image
                    src={sample.src}
                    alt={`Company marble evaluation sample ${sample.imageId}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="min-w-0">
                    <h3 className="font-medium text-zinc-950">
                      Sample {sample.imageId.replace("img_", "")}
                    </h3>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {sample.filename}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-zinc-300">
                      {sample.condition.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary" className="bg-zinc-100">
                      Ground truth: {sample.label}
                    </Badge>
                  </div>
                  <Link
                    href={`/match?sample=${encodeURIComponent(sample.filename)}`}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400"
                  >
                    Use sample in identification
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
