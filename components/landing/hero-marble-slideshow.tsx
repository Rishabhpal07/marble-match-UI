"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { evaluationSamples } from "@/lib/evaluation-samples";

const rotationSamples = evaluationSamples;
const transitionDuration = 900;
const slideInterval = 4500;

export function HeroMarbleSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const showSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        return;
      }

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (prefersReducedMotion) {
        setPreviousIndex(null);
        setIsFading(false);
        setActiveIndex(index);
        return;
      }

      setPreviousIndex(activeIndex);
      setIsFading(false);
      setActiveIndex(index);
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setIsFading(true);
        animationFrameRef.current = null;
      });
      transitionTimeoutRef.current = window.setTimeout(() => {
        setPreviousIndex(null);
        setIsFading(false);
        transitionTimeoutRef.current = null;
      }, transitionDuration);
    },
    [activeIndex, prefersReducedMotion]
  );

  const showRelativeSlide = useCallback(
    (offset: -1 | 1) => {
      showSlide(
        (activeIndex + offset + rotationSamples.length) %
          rotationSamples.length
      );
    },
    [activeIndex, showSlide]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isHovered || prefersReducedMotion || rotationSamples.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      showSlide((activeIndex + 1) % rotationSamples.length);
    }, slideInterval);

    return () => window.clearInterval(intervalId);
  }, [activeIndex, isHovered, prefersReducedMotion, showSlide]);

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );

  const sample = rotationSamples[activeIndex];
  const previousSample =
    previousIndex === null ? null : rotationSamples[previousIndex];

  return (
    <div
      className="relative aspect-[1.2/1] min-h-[280px] overflow-hidden bg-stone-200 sm:aspect-[1.45/1] lg:aspect-[1.16/1]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
        }
      }}
    >
      {previousSample && (
        <Image
          key={previousSample.filename}
          src={previousSample.src}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 55vw"
          className={`absolute inset-0 object-cover transition-opacity duration-[900ms] ease-in-out motion-reduce:transition-none ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
      <Image
        key={sample.filename}
        src={sample.src}
        alt={`Company marble evaluation sample ${sample.imageId}, ${sample.referenceId}, ${sample.condition.replaceAll("_", " ")} condition`}
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 55vw"
        className={`absolute inset-0 object-cover transition-opacity duration-[900ms] ease-in-out motion-reduce:transition-none ${
          previousSample && !isFading ? "opacity-0" : "opacity-100"
        }`}
      />
      <Link
        href={`/match?sample=${encodeURIComponent(sample.filename)}`}
        className="group absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-800"
        aria-label={`Explore evaluation sample ${sample.imageId}, ${sample.referenceId}`}
      >
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent px-5 pb-5 pt-16 text-white sm:px-7 sm:pb-7">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-white/75">
              Company evaluation image
            </span>
            <span
              aria-live="polite"
              className="mt-1.5 block font-serif text-xl"
            >
              {sample.imageId} · {sample.referenceId} ·{" "}
              {sample.condition.replaceAll("_", " ")}
            </span>
            <span
              title={sample.filename}
              className="mt-1 block break-all text-[10px] leading-4 text-white/75 sm:text-xs"
            >
              {sample.filename}
            </span>
          </span>
          <ArrowUpRight
            className="mb-1 size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-5 sm:top-5">
        <div
          role="group"
          aria-label="Choose hero marble image"
          className="flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-2 backdrop-blur-sm"
        >
          {rotationSamples.map((slide, index) => (
            <button
              key={slide.filename}
              type="button"
              onClick={() => showSlide(index)}
              aria-label={`Show ${slide.imageId}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                index === activeIndex
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-4 top-4 z-20 flex gap-1.5 sm:left-5 sm:top-5">
        <button
          type="button"
          onClick={() => showRelativeSlide(-1)}
          aria-label="Previous hero marble image"
          className="flex size-9 items-center justify-center rounded-full border border-white/70 bg-black/15 text-white backdrop-blur-sm outline-none transition-colors hover:bg-black/35 focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => showRelativeSlide(1)}
          aria-label="Next hero marble image"
          className="flex size-9 items-center justify-center rounded-full border border-white/70 bg-black/15 text-white backdrop-blur-sm outline-none transition-colors hover:bg-black/35 focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
