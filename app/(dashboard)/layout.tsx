import type { ReactNode } from "react";

import { PremiumNavigation } from "@/components/layout/premium-navigation";

export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbfaf8] [font-family:var(--font-geist-sans)] text-stone-900">
      <PremiumNavigation />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        {children}
      </main>
    </div>
  );
}
