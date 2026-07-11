import Link from "next/link";
import type { ReactNode } from "react";
import { AppSearch } from "@/app/_components/app-search";

export function AppShell({
  children,
  searchQuery,
}: {
  children: ReactNode;
  searchQuery?: string;
}) {
  return (
    <div className="min-h-screen bg-paper-2 text-ink">
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap text-sm font-semibold text-ink transition-colors hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-neutral"
          >
            <span
              aria-hidden
              className="grid size-7 place-items-center border border-rule-2 bg-ink text-xs text-paper"
            >
              K
            </span>
            <span className="hidden sm:inline">KYC Operations</span>
          </Link>

          <div className="mx-auto hidden w-full max-w-[420px] md:block">
            <AppSearch defaultValue={searchQuery} />
          </div>

          <div className="ms-auto flex min-h-11 items-center gap-3 border-s border-rule ps-4">
            <span className="hidden text-right lg:block">
              <span className="block text-[13px] font-medium text-ink">
                Morgan Lee
              </span>
              <span className="block text-xs text-muted">Reviewer</span>
            </span>
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-accent-soft text-xs font-medium text-accent-strong"
            >
              ML
            </span>
          </div>
        </div>
        <div className="border-t border-rule px-4 py-2 md:hidden">
          <AppSearch defaultValue={searchQuery} />
        </div>
      </header>
      {children}
    </div>
  );
}
