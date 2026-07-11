# KYC Review Queue

A role-aware KYC review queue: an applicant queue, a review flow with
approve/reject decisions, role-based access control, and an audit log.
Built with Next.js (App Router), Prisma on SQLite, Tailwind CSS, and pnpm.

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

## Logging in

The seed script creates two users. These are local development credentials
only.

| Role     | Email                | Password        |
| -------- | -------------------- | --------------- |
| Reviewer | `reviewer@kyc.test`  | `reviewer-demo` |
| Admin    | `admin@kyc.test`     | `admin-demo`    |

## Using the app

1. Log in as the reviewer (`reviewer@kyc.test` / `reviewer-demo`).
2. Browse the applicant queue. Filter by status, risk, or text; pending
   applicants are shown first.
3. Open an applicant to see their identity, document, assignment, decision,
   and activity details.
4. Approve or reject the applicant. A decision reason is required to submit.
5. Log out, log in as the admin (`admin@kyc.test` / `admin-demo`), and open
   `/audit` to see every decision recorded with its before/after status.

## What's implemented

- Applicant queue with status, risk, and text filters (pending-first).
- Approve/reject flow with a required decision reason.
- Server-side enforcement of role permissions and status transitions; the
  session and role are checked on the server, not just hidden in the UI.
- Append-only audit log recording each decision with its before/after
  status, with an admin-only UI at `/audit`.
