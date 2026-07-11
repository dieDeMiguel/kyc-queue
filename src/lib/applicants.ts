import {
  ApplicantStatus,
  DocumentType,
  Prisma,
  RiskLevel,
} from "@prisma/client";
import { db } from "@/lib/db";

export const applicantStatuses = [
  ApplicantStatus.PENDING,
  ApplicantStatus.IN_REVIEW,
  ApplicantStatus.APPROVED,
  ApplicantStatus.REJECTED,
] as const;

export const riskLevels = [
  RiskLevel.LOW,
  RiskLevel.MEDIUM,
  RiskLevel.HIGH,
] as const;

export type ApplicantStatusFilter = ApplicantStatus | "ALL";
export type RiskLevelFilter = RiskLevel | "ALL";

export type ApplicantListItem = Prisma.ApplicantGetPayload<{
  include: { assignedReviewer: true };
}>;

const statusLabels: Record<ApplicantStatus, string> = {
  PENDING: "Pending",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const riskLabels: Record<RiskLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const documentLabels: Record<DocumentType, string> = {
  PASSPORT: "Passport",
  NATIONAL_ID: "National ID",
  DRIVERS_LICENSE: "Driver’s license",
  RESIDENCE_PERMIT: "Residence permit",
};

export function formatApplicantStatus(status: ApplicantStatus) {
  return statusLabels[status];
}

export function formatRiskLevel(level: RiskLevel) {
  return riskLabels[level];
}

export function formatDocumentType(type: DocumentType) {
  return documentLabels[type];
}

export function isApplicantStatus(value: string): value is ApplicantStatus {
  return applicantStatuses.some((status) => status === value);
}

export function isRiskLevel(value: string): value is RiskLevel {
  return riskLevels.some((level) => level === value);
}

export async function getApplicantQueue({
  status,
  risk,
  query,
}: {
  status: ApplicantStatusFilter;
  risk: RiskLevelFilter;
  query: string;
}) {
  const where: Prisma.ApplicantWhereInput = {
    ...(status === "ALL" ? {} : { status }),
    ...(risk === "ALL" ? {} : { riskLevel: risk }),
    ...(query
      ? {
          OR: [
            { caseId: { contains: query } },
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
          ],
        }
      : {}),
  };

  const [applicants, groupedCounts, totalCount] = await Promise.all([
    db.applicant.findMany({
      where,
      include: { assignedReviewer: true },
      orderBy: [{ riskScore: "desc" }, { submittedAt: "asc" }],
    }),
    db.applicant.groupBy({
      by: ["status"],
      _count: true,
    }),
    db.applicant.count(),
  ]);

  const counts = Object.fromEntries(
    applicantStatuses.map((applicantStatus) => [
      applicantStatus,
      groupedCounts.find(({ status: current }) => current === applicantStatus)
        ?._count ?? 0,
    ]),
  ) as Record<ApplicantStatus, number>;

  return { applicants, counts, totalCount };
}

export function getApplicantById(id: string) {
  return db.applicant.findUnique({
    where: { id },
    include: {
      assignedReviewer: true,
      auditEvents: {
        include: { actor: true },
        orderBy: { createdAt: "desc" },
      },
      reviewActions: {
        include: { actor: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
