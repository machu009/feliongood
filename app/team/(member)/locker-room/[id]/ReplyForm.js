"use client";

import { useState, useTransition } from "react";
import { createReply } from "../actions";

export default function ReplyForm({ threadId }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);
    startTransition(async () => {
      const res = await createReply(threadId, formData);
      if (res?.error) setError(res.error);
      else e.target.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Write a reply…"
        className="w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
      />
      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-5 py-2.5 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post Reply"}
      </button>
    </form>
  );
}
