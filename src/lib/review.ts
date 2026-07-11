import { ApplicantStatus, ReviewDecision } from "@prisma/client";

export const REASON_MAX_LENGTH = 1000;

const decidableStatuses: ReadonlySet<ApplicantStatus> = new Set([
  ApplicantStatus.PENDING,
  ApplicantStatus.IN_REVIEW,
]);

const decisionStatus: Record<ReviewDecision, ApplicantStatus> = {
  APPROVE: ApplicantStatus.APPROVED,
  REJECT: ApplicantStatus.REJECTED,
};

export function isReviewDecision(value: string): value is ReviewDecision {
  return value === ReviewDecision.APPROVE || value === ReviewDecision.REJECT;
}

export function canDecide(status: ApplicantStatus) {
  return decidableStatuses.has(status);
}

export function statusForDecision(decision: ReviewDecision) {
  return decisionStatus[decision];
}

export function decisionBlockedMessage(status: ApplicantStatus) {
  if (status === ApplicantStatus.APPROVED) {
    return "This case is already approved and cannot be changed.";
  }
  if (status === ApplicantStatus.REJECTED) {
    return "This case is already rejected and cannot be changed.";
  }
  return "This case can no longer be decided.";
}
