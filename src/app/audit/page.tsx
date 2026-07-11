import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/app/_components/app-shell";
import { StatusBadge } from "@/app/_components/applicant-badges";
import { requireRole } from "@/lib/auth";
import { getAuditEvents } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Audit log",
  description: "Full, immutable audit trail of KYC operations.",
};

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AuditPage() {
  await requireRole("ADMIN");
  const events = await getAuditEvents();

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <header className="border-b border-rule pb-7">
          <p className="text-xs uppercase tracking-[0.08em] text-muted">
            Administrator
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
            Audit log
          </h1>
          <p className="mt-2 max-w-[62ch] text-sm leading-6 text-ink-2 sm:text-base">
            Every sign-in, import, and decision recorded across the workspace.
            Showing the {events.length} most recent events.
          </p>
        </header>

        <section className="mt-8 border border-rule bg-paper">
          <ol className="divide-y divide-rule">
            {events.map((event) => (
              <li
                key={event.id}
                className="grid gap-2 p-5 sm:grid-cols-[170px_minmax(0,1fr)]"
              >
                <time className="text-xs text-muted">
                  {dateTimeFormatter.format(event.createdAt)}
                </time>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium capitalize text-ink">
                    {event.action.replaceAll("_", " ").toLowerCase()}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-2">
                    {event.details}
                  </p>
                  {event.fromStatus && event.toStatus ? (
                    <p className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={event.fromStatus} />
                      <span aria-hidden className="text-muted">
                        →
                      </span>
                      <StatusBadge status={event.toStatus} />
                    </p>
                  ) : null}
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                    <span>
                      {event.actor
                        ? `${event.actor.name} · ${event.actor.role.toLowerCase()}`
                        : "System"}
                    </span>
                    {event.applicant ? (
                      <>
                        <span aria-hidden>·</span>
                        <Link
                          href={`/applicants/${event.applicant.id}`}
                          className="font-mono text-ink-2 underline decoration-transparent underline-offset-2 hover:decoration-current"
                        >
                          {event.applicant.caseId}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </AppShell>
  );
}
