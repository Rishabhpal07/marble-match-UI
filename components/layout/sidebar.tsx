"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gem,
  LayoutDashboard,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

export const dashboardNavigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Marble Catalogue",
    href: "/marbles",
    icon: Gem,
  },
  {
    title: "Identify Marble",
    href: "/match",
    icon: ScanSearch,
  },
] as const;

type DashboardSidebarProps = {
  className?: string;
};

type DashboardSidebarContentProps = {
  onNavigate?: () => void;
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-zinc-950 text-zinc-100 shadow-xl lg:flex",
        className
      )}
      aria-label="Primary navigation"
    >
      <DashboardSidebarContent />
    </aside>
  );
}

export function DashboardSidebarContent({
  onNavigate,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const displayName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    (isLoaded ? "Signed-in user" : "Loading account...");
  const displayEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="flex min-h-0 w-full flex-col">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={onNavigate}
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-white text-zinc-950 shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold leading-5">
              MarbleMatch
            </span>
            <span className="text-xs font-medium text-zinc-400">
              Inventory Studio
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Dashboard">
        {dashboardNavigation.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-zinc-300 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70",
                active && "bg-white text-zinc-950 shadow-sm hover:bg-white"
              )}
            >
              <Icon
                className={cn(
                  "size-4 text-zinc-500 transition-colors group-hover:text-white",
                  active && "text-zinc-950 group-hover:text-zinc-950"
                )}
                aria-hidden="true"
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
          <UserButton
            showName={false}
            appearance={{
              elements: {
                userButtonAvatarBox: "size-10",
                userButtonTrigger:
                  "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70",
              },
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {displayEmail ?? "MarbleMatch account"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
