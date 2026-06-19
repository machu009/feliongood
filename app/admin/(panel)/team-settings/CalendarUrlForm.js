"use client";

import { useState, useTransition } from "react";
import { updateCalendarUrl } from "./actions";

export default function CalendarUrlForm({ initialValue }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setResult(null);
    startTransition(async () => {
      const res = await updateCalendarUrl(formData);
      setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-3">
      <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
        Google Calendar embed URL
      </label>
      <p className="font-mono text-xs text-ink/50">
        In Google Calendar: Settings → your calendar → &ldquo;Integrate
        calendar&rdquo; → copy the &ldquo;Embed code&rdquo; src URL (or just
        the public calendar address).
      </p>
      <input
        name="google_calendar_embed_url"
        defaultValue={initialValue || ""}
        placeholder="https://calendar.google.com/calendar/embed?src=..."
        className="w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
      />

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}
      {result?.success ? (
        <p className="font-mono text-sm text-turf">Saved.</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-2.5 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Calendar Link"}
      </button>
    </form>
  );
}
