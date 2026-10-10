import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <DashboardHeader />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
