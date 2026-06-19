"use client";

import { useState, useTransition } from "react";
import { submitSignup } from "../actions";

export default function SignupForm({ programId, programName }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const res = await submitSignup(programId, formData);
      setResult(res);
      if (res?.success) {
        e.target.reset();
      }
    });
  }

  if (result?.success) {
    return (
      <div className="border-2 border-turf bg-turf/5 p-6 text-center">
        <p className="stamp inline-block text-turf font-mono text-sm uppercase">
          You&rsquo;re In
        </p>
        <p className="mt-3 text-ink/80">
          Thanks for signing up {programName}! You&rsquo;ll hear back by email
          with next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Parent / Guardian name" name="parentName" required />
        <Field label="Player name" name="playerName" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Player age" name="playerAge" type="number" />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Phone (optional)" name="phone" type="tel" />
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          placeholder="Allergies, positions played, anything else we should know"
        />
      </div>

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-clay px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-clay/90 disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit Sign-Up"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", required = false }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
      />
    </div>
  );
}
