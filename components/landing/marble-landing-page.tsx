"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ScanSearch,
} from "lucide-react";
import { useRef, type KeyboardEvent } from "react";

import {
  evaluationSamples,
  type EvaluationSample,
} from "@/lib/evaluation-samples";
import { HeroMarbleSlideshow } from "@/components/landing/hero-marble-slideshow";
import { PremiumNavigation } from "@/components/layout/premium-navigation";

const conditionLabels = {
  lighting: "Lighting",
  occlusion: "Occlusion",
  rotation_scale: "Rotation / scale",
  viewpoint: "Viewpoint",
} as const;

const featuredImageIds = [
  "img_008",
  "img_005",
  "img_010",
  "img_013",
  "img_020",
  "img_030",
];

const featuredSamples = featuredImageIds
  .map((imageId) =>
    evaluationSamples.find((sample) => sample.imageId === imageId)
  )
  .filter((sample): sample is EvaluationSample => sample !== undefined);

const comparisonGroups = Array.from(
  new Set(evaluationSamples.map((sample) => sample.referenceId.slice(0, 3)))
)
  .map((groupId) => ({
    groupId,
    same: evaluationSamples.find(
      (sample) =>
        sample.referenceId.startsWith(groupId) && sample.label === "same"
    ),
    lookalike: evaluationSamples.find(
      (sample) =>
        sample.referenceId.startsWith(groupId) && sample.label === "lookalike"
    ),
  }))
  .filter(
    (
      group
    ): group is {
      groupId: string;
      same: EvaluationSample;
      lookalike: EvaluationSample;
    } => group.same !== undefined && group.lookalike !== undefined
  );

function sampleMatchHref(sample: EvaluationSample) {
  return `/match?sample=${encodeURIComponent(sample.filename)}`;
}

function SampleImage({
  sample,
  className,
  priority = false,
}: {
  sample: EvaluationSample;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={sample.src}
      alt={`Company marble evaluation image ${sample.imageId}, ${conditionLabels[sample.condition]} condition`}
      fill
      unoptimized
      priority={priority}
      sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 33vw"
      className={className ?? "object-cover"}
    />
  );
}

export function MarbleLandingPage() {
  const featuredRowRef = useRef<HTMLDivElement>(null);
  const identificationSample = evaluationSamples.find(
    (sample) => sample.imageId === "img_020"
  );

  if (!identificationSample) {
    throw new Error("Required company evaluation image is missing.");
  }

  function scrollFeatured(direction: -1 | 1) {
    const row = featuredRowRef.current;
    if (row) {
      const distance = direction * row.clientWidth * 0.78;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        row.scrollLeft += distance;
      } else {
        row.scrollBy({ left: distance, behavior: "smooth" });
      }
    }
  }

  function handleFeaturedKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scrollFeatured(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <main
      data-marble-landing
      className="min-h-screen bg-[#fbfaf8] [font-family:var(--font-geist-sans)] text-stone-900"
    >
      <PremiumNavigation />

      <section
        aria-labelledby="hero-title"
        className="mx-auto grid min-h-[min(740px,calc(100svh-68px))] max-w-[1440px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-12 lg:py-16"
      >
        <div className="order-2 max-w-xl pb-2 lg:order-1 lg:pb-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-stone-500 sm:text-xs">
            MarbleMatch / Material Exploration
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-serif text-[clamp(3.25rem,7vw,6.75rem)] font-normal leading-[0.94] tracking-[-0.055em] text-stone-900"
          >
            Every surface tells a story.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            Discover marble textures, explore material samples, and identify
            visually similar surfaces.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/samples"
              className="group inline-flex min-h-12 items-center gap-3 border-b border-stone-900 pb-1 text-sm font-medium text-stone-900 outline-none transition-colors hover:border-stone-500 hover:text-stone-500 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Explore the Collection
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/match"
              className="inline-flex min-h-12 items-center text-sm text-stone-600 outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Identify a Marble
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroMarbleSlideshow />
        </div>
      </section>

      <section
        aria-labelledby="featured-title"
        className="border-y border-stone-200 bg-[#f3f1ed] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
                From the evaluation collection
              </p>
              <h2
                id="featured-title"
                className="mt-3 font-serif text-4xl font-normal tracking-tight sm:text-5xl"
              >
                A study in stone.
              </h2>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollFeatured(-1)}
                aria-label="Scroll featured samples left"
                className="flex size-10 items-center justify-center rounded-full border border-stone-300 text-stone-800 outline-none transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured(1)}
                aria-label="Scroll featured samples right"
                className="flex size-10 items-center justify-center rounded-full border border-stone-300 text-stone-800 outline-none transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={featuredRowRef}
            tabIndex={0}
            aria-label="Featured company evaluation samples"
            onKeyDown={handleFeaturedKeyDown}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 outline-none focus-visible:ring-2 focus-visible:ring-stone-500 sm:gap-5"
          >
            {featuredSamples.map((sample, index) => (
              <Link
                key={sample.filename}
                href={sampleMatchHref(sample)}
                className="group w-[78vw] max-w-[360px] shrink-0 snap-start outline-none focus-visible:ring-2 focus-visible:ring-stone-700 sm:w-[44vw] lg:w-[calc((100%-3rem)/4)]"
              >
                <span className="relative block aspect-[1.12/1] overflow-hidden bg-stone-200">
                  <SampleImage
                    sample={sample}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none"
                  />
                  <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-[#fbfaf8]/90 text-stone-900 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-4 flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-serif text-xl">
                      {sample.referenceId}
                    </span>
                    <span className="mt-1 block text-xs text-stone-500">
                      {conditionLabels[sample.condition]} · Company sample{" "}
                      {sample.imageId.replace("img_", "")}
                    </span>
                  </span>
                  <span className="pt-1 text-xs tabular-nums text-stone-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
            <p className="text-xs text-stone-500">
              Original company evaluation images; not application predictions.
            </p>
            <Link
              href="/samples"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Explore all samples
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="identification-title"
        className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-28"
      >
        <div className="relative aspect-[1.3/1] overflow-hidden bg-stone-200">
          <SampleImage sample={identificationSample} className="object-cover" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-[#fbfaf8]/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-stone-700 sm:left-6 sm:top-6">
            <ScanSearch className="size-4" aria-hidden="true" />
            Image exploration
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-5 pt-14 text-sm text-white sm:px-7 sm:pb-7">
            {identificationSample.referenceId} ·{" "}
            {conditionLabels[identificationSample.condition]} · company sample
          </span>
        </div>

        <div className="max-w-xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
            Image-led exploration
          </p>
          <h2
            id="identification-title"
            className="mt-4 font-serif text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl"
          >
            Find the closest surface.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            Start with a photograph and explore the provided evaluation
            samples. The current flow is a demonstration; an image-matching
            engine is not connected.
          </p>

          <ol className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
            {[
              "Upload or capture a marble image.",
              "Review the available sample comparisons.",
              "Explore the relevant marble details.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 py-4 text-sm text-stone-700"
              >
                <span className="font-serif text-lg text-stone-400">
                  0{index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <Link
            href="/match"
            className="mt-7 inline-flex min-h-12 items-center gap-3 bg-stone-900 px-5 text-sm font-medium text-white outline-none transition-colors hover:bg-stone-700 focus-visible:ring-2 focus-visible:ring-stone-600 focus-visible:ring-offset-2"
          >
            Start identification
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="comparison-title"
        className="bg-[#ece9e3] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
              Company evaluation examples
            </p>
            <h2
              id="comparison-title"
              className="mt-3 font-serif text-4xl font-normal tracking-tight sm:text-5xl"
            >
              Same, or lookalike?
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              These pairings are organized by their shared filename reference
              family. “Same” and “lookalike” are the dataset’s ground-truth
              labels, not predictions made by MarbleMatch.
            </p>
          </div>

          <div className="grid gap-x-6 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
            {comparisonGroups.slice(0, 3).map(({ groupId, same, lookalike }) => (
              <article key={groupId} className="min-w-0">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl">{groupId} reference</h3>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-stone-500">
                    Evaluation pair
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { sample: same, label: "Same" },
                    { sample: lookalike, label: "Lookalike" },
                  ].map(({ sample, label }) => (
                    <Link
                      key={sample.filename}
                      href={sampleMatchHref(sample)}
                      className="group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
                    >
                      <span className="relative block aspect-[1.08/1] overflow-hidden bg-stone-300">
                        <SampleImage
                          sample={sample}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                      </span>
                      <span className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                        <span className="text-xs font-medium text-stone-800">
                          Ground truth: {label}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {sample.referenceId} ·{" "}
                          {conditionLabels[sample.condition]}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/samples"
            className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-stone-800 underline decoration-stone-400 underline-offset-4 transition-colors hover:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
          >
            Browse the full evaluation set
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 text-center sm:px-8 sm:py-24 lg:py-28">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
          Made for material discovery
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-normal leading-tight tracking-tight sm:text-6xl">
          Let the details lead you.
        </h2>
        <Link
          href="/samples"
          className="mt-7 inline-flex min-h-12 items-center gap-3 border border-stone-400 px-5 text-sm font-medium text-stone-900 outline-none transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white focus-visible:ring-2 focus-visible:ring-stone-500"
        >
          Explore marble samples
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <footer className="border-t border-stone-200 bg-[#f3f1ed]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Link
            href="/"
            className="font-serif text-lg text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
          >
            MarbleMatch
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-stone-600"
          >
            <Link
              href="/"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Home
            </Link>
            <Link
              href="/samples"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Samples
            </Link>
            <Link
              href="/marbles"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Catalogue
            </Link>
            <Link
              href="/match"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Identify Marble
            </Link>
            <Link
              href="/sign-in"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Sign Up
            </Link>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">
            Material exploration
          </p>
        </div>
      </footer>
    </main>
  );
}
