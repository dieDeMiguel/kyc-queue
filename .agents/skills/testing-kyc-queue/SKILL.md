---
name: testing-kyc-queue
description: Test the seeded KYC reviewer queue end-to-end. Use when verifying queue filters, search, applicant details, review decisions, or audit history.
---

# Testing the KYC Queue

## Devin Secrets Needed

None.

## Local setup

Run from the repository root:

```bash
npx --yes pnpm@10.13.1 install
npx --yes pnpm@10.13.1 db:setup
npx --yes pnpm@10.13.1 db:seed
npx --yes pnpm@10.13.1 dev
```

`db:setup` applies migrations and generates Prisma Client. Run `db:seed` explicitly before testing when the fixture state must be reset; an already-synchronized `prisma migrate dev` may not rerun the seed.

The current queue slice has no login gate or external service dependency.

## Deterministic fixtures

- Total: `30`
- Statuses: `18 PENDING`, `4 IN_REVIEW`, `5 APPROVED`, `3 REJECTED`
- Default first row: Fatima Zahra, `KYC-2026-0009`, risk `91 HIGH`
- Approved + High: Tariq Rahman, `KYC-2026-0024`, risk `88 HIGH`
- Exact search `KYC-2026-0001`: Amara Okafor, risk `84 HIGH`

Tariq is the best auditability fixture:

- Bangladesh `(BD)`
- Residence permit, masked number `•••• 4006`
- Assigned reviewer Morgan Lee
- Approved with the required reason
- Audit history includes import by Alex Rivera and approval by Morgan Lee

## Browser flow

1. Open `/` and verify the status counts, pending default, and risk-first order.
2. Select `Approved`, apply, and verify five results.
3. Select `High`, apply, and verify only Tariq remains.
4. Open Tariq and verify identity, document, review summary, latest decision, and both audit events.
5. Return to `/`, use `Ctrl+K`, search `KYC-2026-0001`, and verify only Amara remains.

Use the visible selects, buttons, applicant links, and search field. Record GUI testing and annotate consolidated assertions for the default queue, each narrowing step, the detail/audit view, and exact search.
