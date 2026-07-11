import { scryptSync } from "node:crypto";
import {
  ApplicantStatus,
  DocumentType,
  PrismaClient,
  ReviewDecision,
  RiskLevel,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

const people = [
  ["Amara", "Okafor"],
  ["Liam", "Chen"],
  ["Sofia", "Martínez"],
  ["Noah", "Williams"],
  ["Amina", "Hassan"],
  ["Mateo", "Silva"],
  ["Priya", "Sharma"],
  ["Oliver", "Smith"],
  ["Fatima", "Zahra"],
  ["Lucas", "Dubois"],
  ["Mei", "Tan"],
  ["Elias", "Andersson"],
  ["Camila", "Rojas"],
  ["Kwame", "Mensah"],
  ["Hana", "Sato"],
  ["Daniel", "Kim"],
  ["Leila", "Mansour"],
  ["Jakub", "Nowak"],
  ["Valentina", "Costa"],
  ["Yusuf", "Demir"],
  ["Nora", "Berg"],
  ["Ravi", "Patel"],
  ["Ines", "Moreau"],
  ["Tariq", "Rahman"],
  ["Elena", "Popescu"],
  ["Samuel", "Adeyemi"],
  ["Maya", "Singh"],
  ["Tomás", "Herrera"],
  ["Aya", "Nakamura"],
  ["Mila", "Petrović"],
] as const;

const locations = [
  ["Nigeria", "NG"],
  ["Singapore", "SG"],
  ["Spain", "ES"],
  ["Canada", "CA"],
  ["Morocco", "MA"],
  ["Brazil", "BR"],
  ["India", "IN"],
  ["United Kingdom", "GB"],
  ["Jordan", "JO"],
  ["France", "FR"],
  ["Malaysia", "MY"],
  ["Sweden", "SE"],
  ["Colombia", "CO"],
  ["Ghana", "GH"],
  ["Japan", "JP"],
  ["South Korea", "KR"],
  ["Lebanon", "LB"],
  ["Poland", "PL"],
  ["Portugal", "PT"],
  ["Türkiye", "TR"],
  ["Norway", "NO"],
  ["India", "IN"],
  ["France", "FR"],
  ["Bangladesh", "BD"],
  ["Romania", "RO"],
  ["Nigeria", "NG"],
  ["India", "IN"],
  ["Mexico", "MX"],
  ["Japan", "JP"],
  ["Serbia", "RS"],
] as const;

const riskScores = [
  84, 27, 63, 18, 76, 45, 32, 57, 91, 23, 68, 39, 72, 14, 52, 34, 81, 48, 29,
  66, 21, 74, 43, 88, 36, 59, 17, 79, 41, 69,
];

const documentTypes = [
  DocumentType.PASSPORT,
  DocumentType.NATIONAL_ID,
  DocumentType.DRIVERS_LICENSE,
  DocumentType.RESIDENCE_PERMIT,
] as const;

function riskLevel(score: number) {
  if (score >= 70) return RiskLevel.HIGH;
  if (score >= 40) return RiskLevel.MEDIUM;
  return RiskLevel.LOW;
}

function applicantStatus(index: number) {
  if (index < 18) return ApplicantStatus.PENDING;
  if (index < 22) return ApplicantStatus.IN_REVIEW;
  if (index < 27) return ApplicantStatus.APPROVED;
  return ApplicantStatus.REJECTED;
}

function passwordHash(password: string, salt: string) {
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.reviewAction.deleteMany();
  await prisma.applicant.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const reviewer = await prisma.user.create({
    data: {
      email: "reviewer@kyc.test",
      name: "Morgan Lee",
      role: Role.REVIEWER,
      passwordHash: passwordHash("reviewer-demo", "reviewer-seed"),
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@kyc.test",
      name: "Alex Rivera",
      role: Role.ADMIN,
      passwordHash: passwordHash("admin-demo", "admin-seed"),
    },
  });

  for (const [index, [firstName, lastName]] of people.entries()) {
    const [country, countryCode] = locations[index];
    const score = riskScores[index];
    const status = applicantStatus(index);
    const submittedAt = new Date(
      Date.UTC(2026, 5, 2 + (index % 24), 8 + (index % 9), (index * 7) % 60),
    );
    const reviewedAt = new Date(submittedAt.getTime() + 36 * 60 * 60 * 1000);
    const assignedReviewerId =
      status === ApplicantStatus.PENDING && index % 3 !== 0 ? null : reviewer.id;

    const applicant = await prisma.applicant.create({
      data: {
        caseId: `KYC-2026-${String(index + 1).padStart(4, "0")}`,
        firstName,
        lastName,
        email:
          `${firstName}.${lastName}`.toLowerCase().replaceAll(" ", "") +
          "@example.test",
        country,
        countryCode,
        dateOfBirth: new Date(
          Date.UTC(1978 + (index % 23), index % 12, 3 + (index % 24)),
        ),
        documentType: documentTypes[index % documentTypes.length],
        documentNumber: `•••• ${String(1407 + index * 113).slice(-4)}`,
        riskScore: score,
        riskLevel: riskLevel(score),
        status,
        assignedReviewerId,
        submittedAt,
      },
    });

    await prisma.auditEvent.create({
      data: {
        actorId: admin.id,
        applicantId: applicant.id,
        action: "APPLICANT_IMPORTED",
        details: `Application ${applicant.caseId} entered the review queue.`,
        createdAt: submittedAt,
      },
    });

    if (status === ApplicantStatus.IN_REVIEW) {
      await prisma.auditEvent.create({
        data: {
          actorId: reviewer.id,
          applicantId: applicant.id,
          action: "REVIEW_STARTED",
          details: "Application assigned to Morgan Lee.",
          createdAt: new Date(submittedAt.getTime() + 90 * 60 * 1000),
        },
      });
    }

    if (
      status === ApplicantStatus.APPROVED ||
      status === ApplicantStatus.REJECTED
    ) {
      const approved = status === ApplicantStatus.APPROVED;
      const reason = approved
        ? "Identity and document checks completed with no unresolved discrepancies."
        : "Document details did not match the submitted identity information.";

      await prisma.reviewAction.create({
        data: {
          applicantId: applicant.id,
          actorId: reviewer.id,
          decision: approved ? ReviewDecision.APPROVE : ReviewDecision.REJECT,
          reason,
          createdAt: reviewedAt,
        },
      });

      await prisma.auditEvent.create({
        data: {
          actorId: reviewer.id,
          applicantId: applicant.id,
          action: approved ? "APPLICANT_APPROVED" : "APPLICANT_REJECTED",
          details: reason,
          createdAt: reviewedAt,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
