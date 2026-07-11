"use server";

import { Prisma, ReviewDecision } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  REASON_MAX_LENGTH,
  canDecide,
  isReviewDecision,
  statusForDecision,
  transitionBlockedMessage,
} from "@/lib/review";

export type ReviewFormState = {
  error?: string;
  fieldError?: string;
  submittedDecision?: ReviewDecision;
};

async function resolveActorId() {
  const actor = await db.user.findUnique({
    where: { email: "reviewer@kyc.test" },
    select: { id: true },
  });

  if (!actor) {
    throw new Error("No reviewer account is available to record a decision.");
  }

  return actor.id;
}

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const applicantId = String(formData.get("applicantId") ?? "");
  const decisionValue = String(formData.get("decision") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!applicantId) {
    return { error: "Missing applicant reference." };
  }

  if (!isReviewDecision(decisionValue)) {
    return { error: "Choose approve or reject to record a decision." };
  }

  const decision = decisionValue;

  if (decision === ReviewDecision.REJECT && reason.length === 0) {
    return {
      submittedDecision: decision,
      fieldError: "A reason is required to reject a case.",
    };
  }

  if (reason.length > REASON_MAX_LENGTH) {
    return {
      submittedDecision: decision,
      fieldError: `Keep the reason under ${REASON_MAX_LENGTH} characters.`,
    };
  }

  const actorId = await resolveActorId();
  const nextStatus = statusForDecision(decision);
  const storedReason =
    reason.length > 0
      ? reason
      : "Identity and document checks completed with no unresolved discrepancies.";

  try {
    await db.$transaction(async (tx) => {
      const applicant = await tx.applicant.findUnique({
        where: { id: applicantId },
        select: { id: true, status: true, caseId: true },
      });

      if (!applicant) {
        throw new ReviewError("This case no longer exists.");
      }

      if (!canDecide(applicant.status)) {
        throw new ReviewError(transitionBlockedMessage(applicant.status));
      }

      await tx.applicant.update({
        where: { id: applicant.id },
        data: {
          status: nextStatus,
          assignedReviewerId: actorId,
        },
      });

      await tx.reviewAction.create({
        data: {
          applicantId: applicant.id,
          actorId,
          decision,
          reason: storedReason,
        },
      });

      await tx.auditEvent.create({
        data: {
          applicantId: applicant.id,
          actorId,
          action:
            decision === ReviewDecision.APPROVE
              ? "APPLICANT_APPROVED"
              : "APPLICANT_REJECTED",
          details: storedReason,
        },
      });
    });
  } catch (error) {
    if (error instanceof ReviewError) {
      return { submittedDecision: decision, error: error.message };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        submittedDecision: decision,
        error: "The decision could not be saved. Try again.",
      };
    }

    throw error;
  }

  revalidatePath(`/applicants/${applicantId}`);
  revalidatePath("/");

  return {};
}

class ReviewError extends Error {}
