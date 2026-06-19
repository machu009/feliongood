"use client";

import { useState, useTransition } from "react";
import { teamLogin } from "./actions";

export default function TeamLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);
    startTransition(async () => {
      const res = await teamLogin(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-turf px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-turf/90 disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
