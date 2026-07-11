import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the KYC review workspace.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper-2 px-4 py-12">
      <div className="w-full max-w-[400px] border border-rule bg-paper p-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-7 place-items-center border border-rule-2 bg-ink text-xs text-paper"
          >
            K
          </span>
          <span className="text-sm font-semibold text-ink">KYC Operations</span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-muted">
          Reviewers triage and decide cases. Admins additionally see all
          decisions and the full audit trail.
        </p>

        <LoginForm />

        <div className="mt-8 border-t border-rule pt-5">
          <p className="text-xs uppercase tracking-[0.08em] text-muted">
            Demo credentials
          </p>
          <dl className="mt-3 space-y-2 text-[13px] text-ink-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reviewer</dt>
              <dd className="font-mono text-xs text-ink">
                reviewer@kyc.test · reviewer-demo
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Admin</dt>
              <dd className="font-mono text-xs text-ink">
                admin@kyc.test · admin-demo
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
