import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function MarbleNotFound() {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
        <Search className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-zinc-950">
        Marble record not found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        This demo marble ID is not in the current catalogue dataset.
      </p>
      <Link
        href="/marbles"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Catalogue
      </Link>
    </section>
  );
}
