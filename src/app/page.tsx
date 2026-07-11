/* Hallmark · macrostructure: Workbench · theme: Geist operational
 * nav: N13 inline utility · footer: none · enrichment: none
 * pre-emit critique: P5 H5 E4 S5 R5 V5
 */
import { ApplicantStatus, RiskLevel } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/app/_components/app-shell";
import { ApplicantTable } from "@/app/_components/applicant-table";
import {
  applicantStatuses,
  formatApplicantStatus,
  formatRiskLevel,
  getApplicantQueue,
  isApplicantStatus,
  isRiskLevel,
  riskLevels,
  type ApplicantStatusFilter,
  type RiskLevelFilter,
} from "@/lib/applicants";

export const metadata: Metadata = {
  title: "Applicant queue",
  description: "Review and triage KYC applicants by status and risk.",
};

export const dynamic = "force-dynamic";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryParams = await searchParams;
  const statusValue = firstValue(queryParams.status);
  const riskValue = firstValue(queryParams.risk);
  const query = firstValue(queryParams.q)?.trim().slice(0, 80) ?? "";
  const status: ApplicantStatusFilter =
    statusValue === "ALL" || (statusValue && isApplicantStatus(statusValue))
      ? statusValue
      : ApplicantStatus.PENDING;
  const risk: RiskLevelFilter =
    riskValue === "ALL" || (riskValue && isRiskLevel(riskValue))
      ? riskValue
      : "ALL";
  const { applicants, counts, totalCount } = await getApplicantQueue({
    status,
    risk,
    query,
  });

  const riskPolicy: Array<[RiskLevel, string, string]> = [
    [RiskLevel.HIGH, "70–100", "Review first"],
    [RiskLevel.MEDIUM, "40–69", "Standard review"],
    [RiskLevel.LOW, "0–39", "Routine checks"],
  ];

  return (
    <AppShell searchQuery={query}>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-10">
          <div className="min-w-0">
            <header className="border-b border-rule pb-7">
              <p className="text-xs uppercase tracking-[0.08em] text-muted">
                Reviewer workspace
              </p>
              <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div className="min-w-0">
                  <h1
                    className="min-w-0 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    Applicant queue
                  </h1>
                  <p className="mt-2 max-w-[62ch] text-sm leading-6 text-ink-2 sm:text-base">
                    Triage identity checks by risk and submission time. Open a
                    case to inspect its document and review history.
                  </p>
                </div>
                <p className="shrink-0 text-[13px] text-muted">
                  <span className="font-medium tabular-nums text-ink">
                    {totalCount}
                  </span>{" "}
                  total applicants
                </p>
              </div>
            </header>

            <section
              aria-label="Queue status"
              className="grid grid-cols-2 border-x border-b border-rule bg-paper lg:grid-cols-4"
            >
              {applicantStatuses.map((applicantStatus) => (
                <Link
                  key={applicantStatus}
                  href={`/?status=${applicantStatus}${risk === "ALL" ? "" : `&risk=${risk}`}`}
                  className="min-h-24 border-b border-e border-rule p-4 transition-colors last:border-e-0 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus active:bg-paper-3 lg:border-b-0"
                >
                  <span className="block text-2xl font-semibold tabular-nums text-ink">
                    {counts[applicantStatus]}
                  </span>
                  <span className="mt-2 block text-[13px] text-muted">
                    {formatApplicantStatus(applicantStatus)}
                  </span>
                </Link>
              ))}
            </section>

            <section className="mt-8" aria-labelledby="queue-results">
              <form
                action="/"
                className="grid gap-4 border border-rule bg-paper p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
              >
                {query ? <input type="hidden" name="q" value={query} /> : null}
                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-ink">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={status}
                    className="filter-control"
                  >
                    <option value="ALL">All statuses</option>
                    {applicantStatuses.map((applicantStatus) => (
                      <option key={applicantStatus} value={applicantStatus}>
                        {formatApplicantStatus(applicantStatus)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-ink">
                    Risk
                  </span>
                  <select
                    name="risk"
                    defaultValue={risk}
                    className="filter-control"
                  >
                    <option value="ALL">All risk levels</option>
                    {riskLevels.map((riskLevel) => (
                      <option key={riskLevel} value={riskLevel}>
                        {formatRiskLevel(riskLevel)}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="primary-button">
                  Apply filters
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="queue-results"
                  className="text-base font-semibold text-ink"
                >
                  {status === "ALL"
                    ? "All applicants"
                    : `${formatApplicantStatus(status)} applicants`}
                </h2>
                <p className="text-[13px] text-muted">
                  Showing{" "}
                  <span className="font-medium tabular-nums text-ink">
                    {applicants.length}
                  </span>
                  {query ? ` for “${query}”` : ""}
                </p>
              </div>

              <div className="mt-3">
                <ApplicantTable applicants={applicants} />
              </div>
            </section>
          </div>

          <aside className="border-t border-rule pt-6 xl:border-s xl:border-t-0 xl:ps-8 xl:pt-2">
            <p className="text-xs uppercase tracking-[0.08em] text-muted">
              Risk policy
            </p>
            <dl className="mt-4 divide-y divide-rule border-y border-rule">
              {riskPolicy.map(([level, range, note]) => (
                <div key={level} className="py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-[13px] font-medium text-ink">
                      {formatRiskLevel(level)}
                    </dt>
                    <dd className="text-xs tabular-nums text-muted">{range}</dd>
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-ink-2">
                    {note}
                  </p>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[13px] leading-5 text-muted">
              Scores prioritize the queue; they do not make a decision
              automatically.
            </p>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
