import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gem,
  ScanSearch,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const stats = [
  {
    label: "Total Marbles",
    value: "248",
    icon: Gem,
    detail: "Demo inventory records",
  },
  {
    label: "Identifications",
    value: "1,284",
    icon: ScanSearch,
    detail: "Sample recognition runs",
  },
  {
    label: "Users",
    value: "36",
    icon: Users,
    detail: "Example team seats",
  },
  {
    label: "Matches Found",
    value: "912",
    icon: CheckCircle2,
    detail: "Illustrative matches only",
  },
] as const;

const marbles = [
  {
    name: "Calacatta Oro",
    id: "MM-DEMO-1048",
    location: "Carrara sample",
    texture:
      "radial-gradient(circle at 18% 22%, rgba(255,255,255,.98), rgba(238,235,226,.62) 30%, transparent 34%), linear-gradient(135deg, transparent 0 30%, rgba(169,143,96,.55) 31% 34%, transparent 35% 58%, rgba(78,78,76,.25) 59% 61%, transparent 62%), linear-gradient(24deg, #f8f7f2, #ded8ca)",
  },
  {
    name: "Nero Marquina",
    id: "MM-DEMO-2163",
    location: "Basque sample",
    texture:
      "linear-gradient(122deg, transparent 0 16%, rgba(255,255,255,.76) 17% 19%, transparent 20% 62%, rgba(255,255,255,.54) 63% 65%, transparent 66%), radial-gradient(circle at 72% 18%, rgba(255,255,255,.2), transparent 18%), linear-gradient(160deg, #111113, #2d2d31 54%, #070708)",
  },
  {
    name: "Verde Alpi",
    id: "MM-DEMO-3307",
    location: "Alpine sample",
    texture:
      "linear-gradient(138deg, transparent 0 24%, rgba(211,225,205,.58) 25% 28%, transparent 29% 68%, rgba(255,255,255,.4) 69% 71%, transparent 72%), radial-gradient(circle at 24% 76%, rgba(111,143,117,.72), transparent 28%), linear-gradient(42deg, #18362f, #315846 48%, #0e201c)",
  },
  {
    name: "Rosso Levanto",
    id: "MM-DEMO-4721",
    location: "Liguria sample",
    texture:
      "linear-gradient(28deg, transparent 0 22%, rgba(248,218,190,.62) 23% 25%, transparent 26% 58%, rgba(255,244,222,.5) 59% 62%, transparent 63%), radial-gradient(circle at 72% 30%, rgba(143,64,63,.9), transparent 32%), linear-gradient(150deg, #4b171c, #8a3432 52%, #2b0e12)",
  },
  {
    name: "Statuario Venato",
    id: "MM-DEMO-5894",
    location: "Tuscan sample",
    texture:
      "linear-gradient(118deg, transparent 0 18%, rgba(92,102,112,.35) 19% 21%, transparent 22% 43%, rgba(175,181,186,.48) 44% 47%, transparent 48% 80%), radial-gradient(circle at 18% 80%, rgba(255,255,255,.95), transparent 30%), linear-gradient(32deg, #f6f6f3, #d5d8d9 50%, #fbfaf6)",
  },
] as const;

const activities = [
  {
    title: "Calacatta Oro sample added",
    detail: "Demo inventory item MM-DEMO-1048 was created.",
    time: "Today, 10:24 AM",
  },
  {
    title: "Nero Marquina identification completed",
    detail: "Sample scan matched against demonstration records.",
    time: "Today, 9:48 AM",
  },
  {
    title: "Catalogue review exported",
    detail: "A demo review list was prepared for the showroom team.",
    time: "Yesterday, 4:12 PM",
  },
  {
    title: "Verde Alpi match confirmed",
    detail: "Illustrative match result marked as accepted.",
    time: "Yesterday, 11:30 AM",
  },
] as const;

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
              Demo Data
            </Badge>
            <span className="text-xs font-medium text-zinc-500">
              Dashboard overview
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
            MarbleMatch workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            A preview dashboard using demonstration data only. Figures,
            marbles, and activity entries are sample content for interface
            review.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white">
          <Sparkles className="size-4" aria-hidden="true" />
          Premium inventory view
        </div>
      </section>

      <section aria-labelledby="dashboard-stats">
        <h2 id="dashboard-stats" className="sr-only">
          Demonstration statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="rounded-lg border border-zinc-200 bg-white shadow-sm ring-0"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-zinc-600">
                    {stat.label}
                  </CardTitle>
                  <CardAction>
                    <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-zinc-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{stat.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-labelledby="recent-marbles" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="recent-marbles"
                className="text-lg font-semibold text-zinc-950"
              >
                Recent Marbles
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Five demonstration samples with generated stone textures.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-200 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              View All
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marbles.map((marble) => (
              <article
                key={marble.id}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
              >
                <div
                  className="h-36 border-b border-zinc-200 bg-cover bg-center"
                  style={{ backgroundImage: marble.texture }}
                  role="img"
                  aria-label={`${marble.name} stone texture preview`}
                />
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-medium text-zinc-950">
                      {marble.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {marble.location}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-100">
                    {marble.id}
                  </Badge>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="recent-activity"
          className="rounded-lg border border-zinc-200 bg-white shadow-sm"
        >
          <div className="p-5">
            <Badge variant="outline" className="border-zinc-300 bg-zinc-50">
              Demonstration Activity
            </Badge>
            <h2
              id="recent-activity"
              className="mt-3 text-lg font-semibold text-zinc-950"
            >
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Sample events for layout review, not live workspace history.
            </p>
          </div>
          <Separator />
          <ol className="divide-y divide-zinc-100">
            {activities.map((activity) => (
              <li key={`${activity.title}-${activity.time}`} className="p-5">
                <div className="flex gap-3">
                  <span className="mt-1 flex size-2.5 shrink-0 rounded-full bg-zinc-950" />
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-950">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      {activity.detail}
                    </p>
                    <p className="mt-2 text-xs font-medium text-zinc-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
