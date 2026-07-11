import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/app/_components/app-shell";
import { requireRole } from "@/lib/auth";
import { getReviewDecisions } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Decisions",
  description: "Every approve and reject decision across the workspace.",
};

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function DecisionsPage() {
  await requireRole("ADMIN");
  const decisions = await getReviewDecisions();

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <header className="border-b border-rule pb-7">
          <p className="text-xs uppercase tracking-[0.08em] text-muted">
            Administrator
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
            All decisions
          </h1>
          <p className="mt-2 max-w-[62ch] text-sm leading-6 text-ink-2 sm:text-base">
            Approvals and rejections logged by every reviewer. Showing the{" "}
            {decisions.length} most recent decisions.
          </p>
        </header>

        <section className="mt-8 overflow-x-auto border border-rule bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-rule text-left text-xs uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-medium">Case</th>
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Decision</th>
                <th className="px-4 py-3 font-medium">Reviewer</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {decisions.map((decision) => (
                <tr key={decision.id} className="align-top">
                  <td className="px-4 py-3">
                    <Link
                      href={`/applicants/${decision.applicant.id}`}
                      className="font-mono text-xs text-ink underline decoration-transparent underline-offset-2 hover:decoration-current"
                    >
                      {decision.applicant.caseId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {decision.applicant.firstName} {decision.applicant.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        decision.decision === "APPROVE"
                          ? "inline-flex items-center border border-success-rule bg-success-soft px-2 py-0.5 text-xs font-medium text-success-strong"
                          : "inline-flex items-center border border-danger-rule bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger-strong"
                      }
                    >
                      {decision.decision === "APPROVE" ? "Approved" : "Rejected"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {decision.actor.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {dateTimeFormatter.format(decision.createdAt)}
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-ink-2">
                    {decision.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
