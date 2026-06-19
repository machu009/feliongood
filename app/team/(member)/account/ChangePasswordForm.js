"use client";

import { useState, useTransition } from "react";
import { changePassword } from "./actions";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setResult(null);
    startTransition(async () => {
      const res = await changePassword(formData);
      setResult(res);
      if (res?.success) e.target.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          New password
        </label>
        <input
          name="new_password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Confirm new password
        </label>
        <input
          name="confirm_password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}
      {result?.success ? (
        <p className="font-mono text-sm text-turf">Password updated.</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-2.5 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
