# KYC Review Queue

A prototype KYC review queue built with Devin in about two hours as a
build-vs-buy evaluation artifact. It replicates the core of an internal
review tool: an applicant queue, a review flow, role-based access control,
and an audit log. It is a prototype for evaluating the approach, not a
production system.

## Demo walkthrough

Two users are created by the seed script. These are local development
credentials only.

| Role     | Email                | Password        |
| -------- | -------------------- | --------------- |
| Reviewer | `reviewer@kyc.test`  | `reviewer-demo` |
| Admin    | `admin@kyc.test`     | `admin-demo`    |

A four-step tour:

1. Log in as the reviewer (`reviewer@kyc.test` / `reviewer-demo`).
2. Open a pending applicant from the queue.
3. Reject it and enter a reason (a reason is required to submit a decision).
4. Log out, log in as the admin (`admin@kyc.test` / `admin-demo`), and open
   `/audit` to see the rejection recorded in the audit log.

## Running locally

Requires Node.js 20.9 or later (a Next.js 16 requirement); tested on
v20.18.1. No Docker and no external services are required — the app uses a
local SQLite file.

```bash
npx --yes pnpm@10.13.1 install
npx --yes pnpm@10.13.1 db:setup
npx --yes pnpm@10.13.1 dev
```

Then open http://localhost:3000 (it redirects to the login page).

`db:setup` creates the SQLite database, applies migrations, generates the
Prisma client, and runs the seed (2 users and 30 applicants).

Other commands:

```bash
npx --yes pnpm@10.13.1 lint
npx --yes pnpm@10.13.1 typecheck
npx --yes pnpm@10.13.1 build
npx --yes pnpm@10.13.1 db:seed
```

## What's implemented

- Applicant queue with status, risk, and text filters (pending-first).
- Approve/reject flow with a required decision reason.
- Server-side enforcement of role permissions and status transitions; the
  session and role are checked on the server, not just hidden in the UI.
- Append-only audit log recording each decision with its before/after
  status, with an admin-only UI at `/audit`.

## What's deliberately stubbed or out of scope

These are scoping decisions for a two-hour prototype, not oversights.

- SSO / IdP integration — a real work item; stubbed here with seeded
  email/password credentials.
- Granular permissions — only two roles (reviewer, admin), not fine-grained
  policies.
- External data connectors — no integrations with KYC vendors or internal
  systems; data comes from the seed.
- Observability — no metrics, tracing, or structured logging.
- Production deployment / hosting — local dev only; no infra or CI/CD.
- Real KYC data and document upload — applicants are mock records; there is
  no file upload or identity verification.

## How this was built

Built across several Devin sessions, one PR per feature, with human review
between sessions:
[applicant queue](https://github.com/dieDeMiguel/kyc-queue/pull/1),
[session auth and RBAC](https://github.com/dieDeMiguel/kyc-queue/pull/4),
and [before/after status in the audit log](https://github.com/dieDeMiguel/kyc-queue/pull/6).
The stack is Next.js (App Router) with TypeScript, Tailwind CSS, and pnpm.
Implementation choices such as the ORM (Prisma on SQLite) and the auth
approach (session cookie with server-side role checks) were delegated to
the agent.
