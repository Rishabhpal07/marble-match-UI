"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  evaluationSamples,
  type EvaluationCondition,
  type EvaluationLabel,
  type EvaluationSample,
} from "@/lib/evaluation-samples";

const conditionLabels: Record<EvaluationCondition, string> = {
  lighting: "Lighting",
  occlusion: "Occlusion",
  rotation_scale: "Rotation / scale",
  viewpoint: "Viewpoint",
};

function matchesSearch(sample: EvaluationSample, search: string) {
  const query = search.trim().toLowerCase();

  return (
    !query ||
    [
      sample.filename,
      sample.imageId,
      sample.referenceId,
      conditionLabels[sample.condition],
      sample.label,
    ].some((value) => value.toLowerCase().includes(query))
  );
}

export function EvaluationSampleBrowser() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState<"all" | EvaluationCondition>(
    "all"
  );
  const [label, setLabel] = useState<"all" | EvaluationLabel>("all");

  const filteredSamples = useMemo(
    () =>
      evaluationSamples.filter(
        (sample) =>
          (condition === "all" || sample.condition === condition) &&
          (label === "all" || sample.label === label) &&
          matchesSearch(sample, search)
      ),
    [condition, label, search]
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
            Company Evaluation Set
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
            Marble image samples
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Browse the company-provided evaluation images. Filename labels are
            dataset ground truth, not results produced by MarbleMatch.
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white">
          {filteredSamples.length} of {evaluationSamples.length} samples
        </div>
      </section>

      <Card className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-base text-zinc-950">
            Search and filter samples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_200px]">
            <div>
              <label
                htmlFor="sample-search"
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
                  id="sample-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search sample, reference, condition, label..."
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 shadow-none focus-visible:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sample-condition"
                className="text-sm font-medium text-zinc-700"
              >
                Condition
              </label>
              <select
                id="sample-condition"
                value={condition}
                onChange={(event) =>
                  setCondition(event.target.value as "all" | EvaluationCondition)
                }
                className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-3 focus:ring-zinc-300/50"
              >
                <option value="all">All conditions</option>
                {Object.entries(conditionLabels).map(([value, display]) => (
                  <option key={value} value={value}>
                    {display}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sample-label"
                className="text-sm font-medium text-zinc-700"
              >
                Ground-truth label
              </label>
              <select
                id="sample-label"
                value={label}
                onChange={(event) =>
                  setLabel(event.target.value as "all" | EvaluationLabel)
                }
                className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-3 focus:ring-zinc-300/50"
              >
                <option value="all">All labels</option>
                <option value="same">Same</option>
                <option value="lookalike">Lookalike</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredSamples.length ? (
        <section
          aria-label="Evaluation image samples"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredSamples.map((sample) => (
            <article
              key={sample.filename}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-zinc-200 bg-zinc-100">
                <Image
                  src={sample.src}
                  alt={`Company evaluation sample ${sample.imageId}, ${conditionLabels[sample.condition]} condition`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-950">
                      Sample {sample.imageId.replace("img_", "")}
                    </h3>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {sample.filename}
                    </p>
                  </div>
                  <Badge
                    variant={sample.label === "same" ? "secondary" : "outline"}
                    className={
                      sample.label === "same"
                        ? "shrink-0 bg-zinc-100"
                        : "shrink-0 border-zinc-300"
                    }
                  >
                    Ground truth: {sample.label}
                  </Badge>
                </div>

                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 p-3 text-sm">
                  <div>
                    <dt className="text-zinc-500">Reference ID</dt>
                    <dd className="mt-1 font-medium text-zinc-950">
                      {sample.referenceId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Condition</dt>
                    <dd className="mt-1 font-medium text-zinc-950">
                      {conditionLabels[sample.condition]}
                    </dd>
                  </div>
                </dl>

                <p className="text-xs leading-5 text-zinc-500">
                  Dataset ground truth for evaluation only; not an application
                  match result.
                </p>

                <Link
                  href={`/match?sample=${encodeURIComponent(sample.filename)}`}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white outline-none transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Use sample in image identification
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">
            No evaluation samples found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Try another search or change the condition and ground-truth label
            filters.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => {
              setSearch("");
              setCondition("all");
              setLabel("all");
            }}
          >
            Clear filters
          </Button>
        </section>
      )}
    </div>
  );
}
