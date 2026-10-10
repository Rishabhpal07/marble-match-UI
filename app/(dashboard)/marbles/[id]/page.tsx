import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, ScanSearch } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { demoMarbles } from "@/lib/demo-marbles";

type MarbleDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return demoMarbles.map((marble) => ({
    id: marble.id,
  }));
}

function getRelatedMarbles(currentId: string) {
  const current = demoMarbles.find((marble) => marble.id === currentId);

  if (!current) {
    return [];
  }

  return demoMarbles
    .filter((marble) => marble.id !== currentId)
    .sort((first, second) => {
      const firstScore =
        Number(first.color === current.color) + Number(first.type === current.type);
      const secondScore =
        Number(second.color === current.color) + Number(second.type === current.type);

      return secondScore - firstScore;
    })
    .slice(0, 3);
}

export default async function MarbleDetailPage({
  params,
}: MarbleDetailPageProps) {
  const { id } = await params;
  const marble = demoMarbles.find((item) => item.id === id);

  if (!marble) {
    notFound();
  }

  const relatedMarbles = getRelatedMarbles(marble.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <li>
            <Link
              href="/"
              className="rounded-md outline-none hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link
              href="/marbles"
              className="rounded-md outline-none hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Marble Catalogue
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li className="font-medium text-zinc-950" aria-current="page">
            {marble.name}
          </li>
        </ol>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,.75fr)]">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <Image
            src={marble.image}
            alt={`${marble.name} demo marble texture`}
            width={960}
            height={630}
            unoptimized
            priority
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <Card className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
                Demo Record
              </Badge>
              <Badge variant="secondary" className="bg-zinc-100">
                {marble.id}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-semibold text-zinc-950">
              {marble.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-6 text-zinc-600">
              {marble.description}
            </p>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-zinc-50 p-3">
                <dt className="text-zinc-500">Color</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {marble.color}
                </dd>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <dt className="text-zinc-500">Type</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {marble.type}
                </dd>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <dt className="text-zinc-500">Finish</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {marble.finish}
                </dd>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <dt className="text-zinc-500">Origin</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {marble.origin}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/marbles"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Catalogue
              </Link>
              <Link
                href="/match"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white outline-none transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <ScanSearch className="size-4" aria-hidden="true" />
                Identify This Marble
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="related-marbles" className="space-y-4">
        <div>
          <h2
            id="related-marbles"
            className="text-lg font-semibold text-zinc-950"
          >
            Related Marbles
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Demo records with similar colour or type, excluding the current
            marble.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedMarbles.map((related) => (
            <Link
              key={related.id}
              href={`/marbles/${related.id}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm outline-none transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <Image
                src={related.image}
                alt={`${related.name} demo marble texture`}
                width={640}
                height={420}
                unoptimized
                className="h-32 w-full border-b border-zinc-200 object-cover"
              />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-zinc-950">
                      {related.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{related.id}</p>
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-950"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-zinc-100">
                    {related.color}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-300">
                    {related.type}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
