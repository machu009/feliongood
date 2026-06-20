"use client";

import { useState, useTransition } from "react";
import { createThread } from "../actions";

export default function NewThreadForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);
    startTransition(async () => {
      const res = await createThread(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Title
        </label>
        <input
          name="title"
          required
          placeholder="What's on your mind?"
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Your message
        </label>
        <textarea
          name="body"
          rows={6}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-clay px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-clay/90 disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post Topic"}
      </button>
    </form>
  );
}
