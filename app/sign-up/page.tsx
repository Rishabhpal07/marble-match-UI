import { SignUp } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { demoMarbles } from "@/lib/demo-marbles";

export const instant = false;

const heroImage = demoMarbles[1]?.image;

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#f5f5f4_0%,_#f1f1f1_38%,_#e7e5e4_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(250,250,249,0.38))]" aria-hidden="true" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_80px_rgba(24,24,27,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[700px] overflow-hidden border-r border-zinc-200 bg-zinc-950 lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(9,9,11,0.72), rgba(24,24,27,0.30)), url(${heroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                <Sparkles className="size-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-200">
                  MarbleMatch
                </p>
                <p className="text-sm text-zinc-300">Inventory Studio</p>
              </div>
            </div>

            <div className="max-w-md space-y-5">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-100 backdrop-blur-sm">
                New workspace
              </span>
              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white">
                Build a premium marble library that your team can trust.
              </h1>
              <p className="text-base leading-7 text-zinc-200/90">
                Invite your team, organise material references, and keep each specification aligned from sourcing to installation.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">Curated sample library</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">
                Premium marble references with confident inventory review and visual matching workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
                  MarbleMatch
                </p>
                <p className="text-sm text-zinc-600">Inventory Studio</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-500">
                Start now
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
                Create account
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Set up a workspace to organise premium marble records and visual identification.
              </p>
            </div>

            <SignUp
              routing="hash"
              signInUrl="/sign-in"
              forceRedirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "w-full",
                  card: "w-full border-0 bg-transparent p-0 shadow-none",
                  headerTitle: "text-zinc-950",
                  headerSubtitle: "text-zinc-600",
                  formFieldLabel: "text-zinc-700",
                  formFieldInput:
                    "h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-950 focus:border-zinc-400 focus:ring-0",
                  formButtonPrimary:
                    "h-12 rounded-xl bg-zinc-950 text-sm font-medium hover:bg-zinc-800",
                  footerActionLink: "font-medium text-zinc-950 hover:text-zinc-700",
                },
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
