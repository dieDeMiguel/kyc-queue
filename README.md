# KYC Review Queue

A role-aware KYC operations workspace built with Next.js, Prisma, and SQLite.

The current slice includes:

- A platform-shaped data model for users, sessions, applicants, review decisions, and audit events.
- A deterministic seed with 2 users and 30 applicants.
- A pending-first applicant queue with status, risk, and text filters.
- Applicant details with identity, document, assignment, decision, and activity data.

Authentication and approve/reject mutations are planned for the next slice.

## Local setup

```bash
npx --yes pnpm@10.13.1 install
npx --yes pnpm@10.13.1 db:setup
npx --yes pnpm@10.13.1 dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` creates the SQLite database, applies migrations, generates the Prisma client, and runs the seed.

## Seeded users

These credentials are local development fixtures for the upcoming session-login slice:

| Role | Email | Password |
| --- | --- | --- |
| Reviewer | `reviewer@kyc.test` | `reviewer-demo` |
| Admin | `admin@kyc.test` | `admin-demo` |

## Commands

```bash
npx --yes pnpm@10.13.1 lint
npx --yes pnpm@10.13.1 typecheck
npx --yes pnpm@10.13.1 build
npx --yes pnpm@10.13.1 db:seed
```
