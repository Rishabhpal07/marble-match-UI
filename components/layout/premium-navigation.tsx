"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/samples", label: "Marble Samples" },
  { href: "/match", label: "Identify Marble" },
  { href: "/marbles", label: "Catalogue" },
];

export function PremiumNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, user } = useUser();
  const pathname = usePathname();

  function isCurrentPath(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fbfaf8]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="MarbleMatch home"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-stone-900 text-stone-50">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl tracking-tight">MarbleMatch</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-[13px] text-stone-600 md:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrentPath(item.href) ? "page" : undefined}
              className={`py-2 transition-colors hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
                isCurrentPath(item.href)
                  ? "font-medium text-stone-950"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-20 items-center justify-end md:flex">
          {isLoaded && user ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-9",
                  userButtonTrigger:
                    "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-stone-500",
                },
              }}
            />
          ) : isLoaded ? (
            <Link
              href="/sign-in"
              className="text-[13px] font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
            >
              Sign In
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-stone-800 outline-none transition-colors hover:bg-stone-200/70 focus-visible:ring-2 focus-visible:ring-stone-500 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-stone-200 bg-[#fbfaf8] px-5 pb-5 pt-2 md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isCurrentPath(item.href) ? "page" : undefined}
                className="border-b border-stone-200/80 py-3 text-sm text-stone-700 outline-none transition-colors hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex min-h-12 items-center pt-3">
              {isLoaded && user ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-9",
                      userButtonTrigger:
                        "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-stone-500",
                    },
                  }}
                />
              ) : isLoaded ? (
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
                >
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
