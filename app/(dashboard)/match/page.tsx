import { MarbleImageUpload } from "@/components/image-upload/marble-image-upload";

export default function MatchPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-zinc-500">
          Identify Marble
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
          Match from an uploaded image
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
          Upload or capture a marble photo, or choose a company evaluation
          sample to review available image comparisons.
        </p>
      </section>

      <MarbleImageUpload />
    </div>
  );
}
