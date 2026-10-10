"use client";

import { useMemo, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSidebarContent, dashboardNavigation } from "./sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/marbles": "Marble Catalogue",
  "/match": "Identify Marble",
  "/history": "History",
  "/settings": "Settings",
};

function getPageTitle(pathname: string) {
  const navigationTitle = dashboardNavigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )?.title;

  return navigationTitle ?? pageTitles[pathname] ?? "Dashboard";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open navigation"
              />
            }
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 max-w-[85vw] border-r border-white/10 bg-zinc-950 p-0 text-zinc-100"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate between MarbleMatch dashboard sections.
            </SheetDescription>
            <DashboardSidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase text-zinc-500">
            MarbleMatch
          </p>
          <h1 className="truncate text-2xl font-semibold tracking-normal text-zinc-950">
            {title}
          </h1>
        </div>

        <div className="hidden w-full max-w-sm items-center md:flex">
          <label className="sr-only" htmlFor="dashboard-search">
            Search inventory
          </label>
          <div className="relative w-full">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <Input
              id="dashboard-search"
              type="search"
              placeholder="Search marble, quarry, finish..."
              className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 shadow-none focus-visible:bg-white"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon-lg"
          className="border-zinc-200 bg-white"
          aria-label="View notifications"
        >
          <Bell aria-hidden="true" />
        </Button>
      </div>

      <div className="border-t border-zinc-100 px-4 pb-4 sm:px-6 md:hidden">
        <label className="sr-only" htmlFor="dashboard-mobile-search">
          Search inventory
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <Input
            id="dashboard-mobile-search"
            type="search"
            placeholder="Search inventory..."
            className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 shadow-none focus-visible:bg-white"
          />
        </div>
      </div>
    </header>
  );
}
