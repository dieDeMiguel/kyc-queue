import type { ApplicantStatus, RiskLevel } from "@prisma/client";
import { formatApplicantStatus, formatRiskLevel } from "@/lib/applicants";

const statusStyles: Record<ApplicantStatus, string> = {
  PENDING: "border-warning-rule bg-warning-soft text-warning-strong",
  IN_REVIEW: "border-accent-rule bg-accent-soft text-accent-strong",
  APPROVED: "border-success-rule bg-success-soft text-success-strong",
  REJECTED: "border-danger-rule bg-danger-soft text-danger-strong",
};

const statusDots: Record<ApplicantStatus, string> = {
  PENDING: "bg-warning",
  IN_REVIEW: "bg-accent",
  APPROVED: "bg-success",
  REJECTED: "bg-danger",
};

const riskStyles: Record<RiskLevel, string> = {
  LOW: "border-success-rule bg-success-soft text-success-strong",
  MEDIUM: "border-warning-rule bg-warning-soft text-warning-strong",
  HIGH: "border-danger-rule bg-danger-soft text-danger-strong",
};

export function StatusBadge({ status }: { status: ApplicantStatus }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium ${statusStyles[status]}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${statusDots[status]}`} />
      {formatApplicantStatus(status)}
    </span>
  );
}

export function RiskBadge({
  level,
  score,
}: {
  level: RiskLevel;
  score: number;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium tabular-nums ${riskStyles[level]}`}
    >
      {score}
      <span className="font-normal">{formatRiskLevel(level)}</span>
    </span>
  );
}
