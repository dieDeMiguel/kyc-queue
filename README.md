# KYC Review Queue

A role-aware KYC operations workspace built with Next.js, Prisma, and SQLite.

The current slice includes:

- A platform-shaped data model for users, sessions, applicants, review decisions, and audit events.
- A deterministic seed with 2 users and 30 applicants.
- Session-based authentication (email + password) with an HTTP-only session cookie.
- Role-based access control with two roles:
  - **Reviewers** see the queue and can approve/reject cases.
  - **Admins** additionally see all decisions (`/decisions`) and the full audit log (`/audit`).
- Server-enforced permissions: the admin pages and the decision mutation verify the session and role on the server, not just via hidden UI.
- A pending-first applicant queue with status, risk, and text filters.
- Applicant details with identity, document, assignment, decision, and activity data.

## Local setup

```bash
npx --yes pnpm@10.13.1 install
npx --yes pnpm@10.13.1 db:setup
npx --yes pnpm@10.13.1 dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` creates the SQLite database, applies migrations, generates the Prisma client, and runs the seed.

## Seeded users

These credentials are local development fixtures for signing in:

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
