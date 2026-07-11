"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink">
          Email
        </span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          aria-invalid={state.error ? true : undefined}
          className="filter-control"
          placeholder="reviewer@kyc.test"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink">
          Password
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          className="filter-control"
          placeholder="••••••••"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="border border-danger-rule bg-danger-soft px-3 py-2 text-[13px] text-danger-strong"
        >
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="primary-button w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
