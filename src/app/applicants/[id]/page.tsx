import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/app/_components/app-shell";
import { RiskBadge, StatusBadge } from "@/app/_components/applicant-badges";
import { ReviewActions } from "@/app/_components/review-actions";
import { formatDocumentType, getApplicantById } from "@/lib/applicants";
import { canDecide } from "@/lib/review";

export const metadata: Metadata = {
  title: "Applicant details",
};

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function ApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicant = await getApplicantById(id);

  if (!applicant) {
    notFound();
  }

  const fullName = `${applicant.firstName} ${applicant.lastName}`;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/" className="back-link">
          ← Back to queue
        </Link>

        <header className="mt-5 border-b border-rule pb-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                {applicant.caseId}
              </p>
              <h1
                className="mt-2 min-w-0 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]"
                style={{ overflowWrap: "anywhere" }}
              >
                {fullName}
              </h1>
              <p className="mt-2 text-sm text-ink-2">{applicant.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RiskBadge
                level={applicant.riskLevel}
                score={applicant.riskScore}
              />
              <StatusBadge status={applicant.status} />
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="space-y-8">
            <DetailSection title="Identity">
              <dl className="grid sm:grid-cols-2">
                <DetailFact label="Full name" value={fullName} />
                <DetailFact
                  label="Date of birth"
                  value={dateFormatter.format(applicant.dateOfBirth)}
                />
                <DetailFact
                  label="Country"
                  value={`${applicant.country} (${applicant.countryCode})`}
                />
                <DetailFact label="Email" value={applicant.email} />
              </dl>
            </DetailSection>

            <DetailSection title="Document">
              <dl className="grid sm:grid-cols-2">
                <DetailFact
                  label="Document type"
                  value={formatDocumentType(applicant.documentType)}
                />
                <DetailFact
                  label="Document number"
                  value={applicant.documentNumber}
                  mono
                />
                <DetailFact
                  label="Submitted"
                  value={dateTimeFormatter.format(applicant.submittedAt)}
                />
                <DetailFact label="Case ID" value={applicant.caseId} mono />
              </dl>
            </DetailSection>

            <DetailSection title="Activity">
              <ol className="divide-y divide-rule">
                {applicant.auditEvents.map((event) => (
                  <li
                    key={event.id}
                    className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)]"
                  >
                    <time className="text-xs text-muted">
                      {dateTimeFormatter.format(event.createdAt)}
                    </time>
                    <div>
                      <p className="text-[13px] font-medium capitalize text-ink">
                        {event.action.replaceAll("_", " ").toLowerCase()}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-2">
                        {event.details}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {event.actor
                          ? `${event.actor.name} · ${event.actor.role.toLowerCase()}`
                          : "System"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </DetailSection>
          </div>

          <aside>
            <section className="border border-rule bg-paper p-5">
              <p className="text-xs uppercase tracking-[0.08em] text-muted">
                Review summary
              </p>
              <dl className="mt-5 space-y-5">
                <SummaryFact
                  label="Assigned reviewer"
                  value={applicant.assignedReviewer?.name ?? "Unassigned"}
                />
                <SummaryFact
                  label="Risk score"
                  value={`${applicant.riskScore} / 100`}
                />
                <SummaryFact
                  label="Risk level"
                  value={applicant.riskLevel.toLowerCase()}
                />
                <SummaryFact
                  label="Status"
                  value={applicant.status.replaceAll("_", " ").toLowerCase()}
                />
              </dl>
              <div className="mt-6 border-t border-rule pt-5">
                <p className="text-[13px] leading-5 text-muted">
                  Risk scores prioritize manual review. A reviewer must still
                  inspect the supplied identity evidence.
                </p>
              </div>
            </section>

            {canDecide(applicant.status) ? (
              <ReviewActions applicantId={applicant.id} />
            ) : null}

            {applicant.reviewActions[0] ? (
              <section className="mt-5 border border-rule bg-paper p-5">
                <p className="text-xs uppercase tracking-[0.08em] text-muted">
                  Latest decision
                </p>
                <p className="mt-4 text-sm font-medium text-ink">
                  {applicant.reviewActions[0].decision === "APPROVE"
                    ? "Approved"
                    : "Rejected"}{" "}
                  by {applicant.reviewActions[0].actor.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-2">
                  {applicant.reviewActions[0].reason}
                </p>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-rule bg-paper">
      <div className="border-b border-rule px-5 py-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetailFact({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-b border-rule py-4 sm:px-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={
          mono
            ? "mt-1 font-mono text-[13px] text-ink"
            : "mt-1 text-sm text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function SummaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-4 last:border-0 last:pb-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-right text-[13px] font-medium capitalize text-ink">
        {value}
      </dd>
    </div>
  );
}
