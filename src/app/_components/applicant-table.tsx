import Link from "next/link";
import type { ReactNode } from "react";
import type { ApplicantListItem } from "@/lib/applicants";
import { formatDocumentType } from "@/lib/applicants";
import { RiskBadge, StatusBadge } from "@/app/_components/applicant-badges";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export function ApplicantTable({
  applicants,
}: {
  applicants: ApplicantListItem[];
}) {
  if (applicants.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center border border-rule bg-paper px-6 text-center">
        <div className="max-w-sm">
          <span
            aria-hidden
            className="mx-auto grid size-10 place-items-center border border-rule-2 text-base"
          >
            0
          </span>
          <h2 className="mt-5 text-xl font-semibold">No applicants match</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Clear the risk or status filter to return to the pending queue.
          </p>
          <Link href="/" className="secondary-button mt-5">
            Reset queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden border border-rule bg-paper md:block">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-rule bg-paper-2">
            <tr>
              <TableHeading>Applicant</TableHeading>
              <TableHeading>Country</TableHeading>
              <TableHeading>Document</TableHeading>
              <TableHeading>Risk</TableHeading>
              <TableHeading>Submitted</TableHeading>
              <TableHeading>Status</TableHeading>
              <th scope="col" className="w-12">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {applicants.map((applicant) => (
              <tr
                key={applicant.id}
                className="group transition-colors hover:bg-paper-2"
              >
                <td className="px-4 py-3.5">
                  <Link
                    href={`/applicants/${applicant.id}`}
                    className="inline-flex min-h-11 flex-col justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-neutral"
                  >
                    <span className="text-sm font-medium text-ink">
                      {applicant.firstName} {applicant.lastName}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {applicant.caseId}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2 text-sm text-ink-2">
                    <span className="grid size-7 place-items-center border border-rule bg-paper-2 text-xs text-ink">
                      {applicant.countryCode}
                    </span>
                    {applicant.country}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-ink-2">
                  {formatDocumentType(applicant.documentType)}
                </td>
                <td className="px-4 py-3.5">
                  <RiskBadge
                    level={applicant.riskLevel}
                    score={applicant.riskScore}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <span className="block text-[13px] text-ink">
                    {dateFormatter.format(applicant.submittedAt)}
                  </span>
                  <span className="block text-xs text-muted">
                    {timeFormatter.format(applicant.submittedAt)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={applicant.status} />
                </td>
                <td className="px-3 py-3.5 text-right">
                  <Link
                    href={`/applicants/${applicant.id}`}
                    aria-label={`Review ${applicant.firstName} ${applicant.lastName}`}
                    className="inline-grid size-11 place-items-center text-xl text-muted transition-colors group-hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-neutral"
                  >
                    →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-rule border border-rule bg-paper md:hidden">
        {applicants.map((applicant) => (
          <Link
            key={applicant.id}
            href={`/applicants/${applicant.id}`}
            className="block p-4 transition-colors hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus active:bg-paper-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  {applicant.caseId}
                </p>
              </div>
              <StatusBadge status={applicant.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
              <MobileFact
                label="Country"
                value={`${applicant.countryCode} · ${applicant.country}`}
              />
              <MobileFact
                label="Document"
                value={formatDocumentType(applicant.documentType)}
              />
              <div>
                <p className="text-xs text-muted">Risk</p>
                <div className="mt-1">
                  <RiskBadge
                    level={applicant.riskLevel}
                    score={applicant.riskScore}
                  />
                </div>
              </div>
              <MobileFact
                label="Submitted"
                value={dateFormatter.format(applicant.submittedAt)}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function TableHeading({ children }: { children: ReactNode }) {
  return (
    <th
      scope="col"
      className="px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-muted"
    >
      {children}
    </th>
  );
}

function MobileFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-[13px] text-ink">{value}</p>
    </div>
  );
}
