"use server";

import { ReviewDecision } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  REASON_MAX_LENGTH,
  canDecide,
  decisionBlockedMessage,
  isReviewDecision,
  statusForDecision,
} from "@/lib/review";

export type DecisionState = { error?: string };

export async function decideApplicant(
  _prevState: DecisionState,
  formData: FormData,
): Promise<DecisionState> {
  // Reviewers and admins may act on cases; enforced server-side.
  const actor = await requireRole("REVIEWER", "ADMIN");

  const applicantId = String(formData.get("applicantId") ?? "");
  const decisionValue = String(formData.get("decision") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!applicantId || !isReviewDecision(decisionValue)) {
    return { error: "Choose a valid decision." };
  }
  if (!reason) {
    return { error: "A decision reason is required." };
  }
  if (reason.length > REASON_MAX_LENGTH) {
    return { error: `Keep the reason under ${REASON_MAX_LENGTH} characters.` };
  }

  const decision = decisionValue as ReviewDecision;

  const applicant = await db.applicant.findUnique({
    where: { id: applicantId },
    select: { id: true, status: true, caseId: true },
  });

  if (!applicant) {
    return { error: "Applicant not found." };
  }
  if (!canDecide(applicant.status)) {
    return { error: decisionBlockedMessage(applicant.status) };
  }

  const nextStatus = statusForDecision(decision);
  const approved = decision === ReviewDecision.APPROVE;

  await db.$transaction([
    db.applicant.update({
      where: { id: applicant.id },
      data: { status: nextStatus, assignedReviewerId: actor.id },
    }),
    db.reviewAction.create({
      data: {
        applicantId: applicant.id,
        actorId: actor.id,
        decision,
        reason,
      },
    }),
    db.auditEvent.create({
      data: {
        actorId: actor.id,
        applicantId: applicant.id,
        action: approved ? "APPLICANT_APPROVED" : "APPLICANT_REJECTED",
        details: reason,
        fromStatus: applicant.status,
        toStatus: nextStatus,
      },
    }),
  ]);

  revalidatePath(`/applicants/${applicant.id}`);
  revalidatePath("/");
  return {};
}
