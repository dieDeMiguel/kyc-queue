"use client";

import { ReviewDecision } from "@prisma/client";
import { useActionState, useId, useState } from "react";
import {
  submitReview,
  type ReviewFormState,
} from "@/app/applicants/[id]/actions";
import { REASON_MAX_LENGTH } from "@/lib/review";

const initialState: ReviewFormState = {};

export function ReviewActions({ applicantId }: { applicantId: string }) {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState,
  );
  const [reason, setReason] = useState("");
  const reasonId = useId();
  const errorId = useId();

  const reasonMissing = reason.trim().length === 0;

  return (
    <section className="mt-5 border border-rule bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.08em] text-muted">
        Record decision
      </p>
      <p className="mt-3 text-[13px] leading-5 text-muted">
        Approve to clear the applicant, or reject with a reason. Decisions are
        final.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="applicantId" value={applicantId} />

        <div>
          <label
            htmlFor={reasonId}
            className="mb-1.5 block text-[13px] font-medium text-ink"
          >
            Reason{" "}
            <span className="font-normal text-muted">
              (required to reject)
            </span>
          </label>
          <textarea
            id={reasonId}
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={REASON_MAX_LENGTH}
            disabled={pending}
            aria-invalid={state.fieldError ? true : undefined}
            aria-describedby={state.fieldError ? errorId : undefined}
            placeholder="Summarize the identity and document checks."
            className="w-full min-h-24 resize-y border border-rule-2 bg-paper p-3 text-sm text-ink outline-2 -outline-offset-1 outline-transparent focus-visible:outline-focus aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-55"
          />
          {state.fieldError ? (
            <p id={errorId} className="mt-1.5 text-[13px] text-danger-strong">
              {state.fieldError}
            </p>
          ) : null}
        </div>

        {state.error ? (
          <p
            role="alert"
            className="border border-danger-rule bg-danger-soft px-3 py-2 text-[13px] text-danger-strong"
          >
            {state.error}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            name="decision"
            value={ReviewDecision.APPROVE}
            disabled={pending}
            className="primary-button w-full"
          >
            {pending && state.submittedDecision === ReviewDecision.APPROVE
              ? "Approving…"
              : "Approve"}
          </button>
          <button
            type="submit"
            name="decision"
            value={ReviewDecision.REJECT}
            disabled={pending || reasonMissing}
            aria-disabled={reasonMissing ? true : undefined}
            title={reasonMissing ? "Add a reason to reject" : undefined}
            className="secondary-button w-full"
          >
            {pending && state.submittedDecision === ReviewDecision.REJECT
              ? "Rejecting…"
              : "Reject"}
          </button>
        </div>
      </form>
    </section>
  );
}
