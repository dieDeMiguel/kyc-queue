import { db } from "@/lib/db";

export function getAuditEvents(limit = 200) {
  return db.auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      details: true,
      fromStatus: true,
      toStatus: true,
      createdAt: true,
      actor: { select: { name: true, role: true } },
      applicant: { select: { id: true, caseId: true } },
    },
  });
}

export function getReviewDecisions(limit = 200) {
  return db.reviewAction.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: { select: { name: true, role: true } },
      applicant: {
        select: { id: true, caseId: true, firstName: true, lastName: true },
      },
    },
  });
}
