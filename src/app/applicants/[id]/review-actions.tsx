"use client";

import { useActionState } from "react";
import {
  decideApplicant,
  type DecisionState,
} from "@/app/applicants/[id]/actions";
import { REASON_MAX_LENGTH } from "@/lib/review";

const initialState: DecisionState = {};

export function ReviewActions({ applicantId }: { applicantId: string }) {
  const [state, formAction, pending] = useActionState(
    decideApplicant,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="applicantId" value={applicantId} />

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink">
          Decision reason
        </span>
        <textarea
          name="reason"
          required
          rows={3}
          maxLength={REASON_MAX_LENGTH}
          className="filter-control min-h-24 py-2 leading-6"
          placeholder="Summarize the evidence supporting this decision."
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="decision"
          value="APPROVE"
          disabled={pending}
          className="primary-button flex-1"
        >
          Approve
        </button>
        <button
          type="submit"
          name="decision"
          value="REJECT"
          disabled={pending}
          className="secondary-button flex-1"
        >
          Reject
        </button>
      </div>
    </form>
  );
}
