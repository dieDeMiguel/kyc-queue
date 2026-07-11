import Link from "next/link";
import type { ReactNode } from "react";
import { AppSearch } from "@/app/_components/app-search";
import { logout } from "@/app/actions/auth";
import { getCurrentUser, type SessionUser } from "@/lib/auth";

const roleLabels: Record<SessionUser["role"], string> = {
  REVIEWER: "Reviewer",
  ADMIN: "Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function AppShell({
  children,
  searchQuery,
}: {
  children: ReactNode;
  searchQuery?: string;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

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

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <Link href="/" className="nav-link">
              Queue
            </Link>
            {isAdmin ? (
              <>
                <Link href="/decisions" className="nav-link">
                  Decisions
                </Link>
                <Link href="/audit" className="nav-link">
                  Audit log
                </Link>
              </>
            ) : null}
          </nav>

          <div className="mx-auto hidden w-full max-w-[360px] md:block">
            <AppSearch defaultValue={searchQuery} />
          </div>

          <div className="ms-auto flex min-h-11 items-center gap-3 border-s border-rule ps-4">
            {user ? (
              <>
                <span className="hidden text-right lg:block">
                  <span className="block text-[13px] font-medium text-ink">
                    {user.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {roleLabels[user.role]}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-accent-soft text-xs font-medium text-accent-strong"
                >
                  {initials(user.name)}
                </span>
                <form action={logout}>
                  <button type="submit" className="secondary-button">
                    Sign out
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-rule px-4 py-2 md:hidden">
          <AppSearch defaultValue={searchQuery} />
        </div>
      </header>
      {children}
    </div>
  );
}
