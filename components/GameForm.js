"use client";

import { useState, useTransition } from "react";

export default function GameForm({ initialValues = {}, action, submitLabel, programId }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);
    startTransition(async () => {
      const res = await action(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {/* Hidden program_id field */}
      <input type="hidden" name="program_id" value={programId || ""} />

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Opponent
        </label>
        <input
          name="opponent"
          defaultValue={initialValues.opponent || ""}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Date
          </label>
          <input
            type="date"
            name="game_date"
            defaultValue={initialValues.game_date || ""}
            required
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Time
          </label>
          <input
            name="game_time"
            placeholder="e.g. 4:30 PM"
            defaultValue={initialValues.game_time || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Location
        </label>
        <input
          name="location"
          defaultValue={initialValues.location || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 font-mono text-sm">
        <input
          type="checkbox"
          name="is_home"
          defaultChecked={initialValues.is_home ?? true}
          className="h-4 w-4"
        />
        Home game
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Result
          </label>
          <select
            name="result"
            defaultValue={initialValues.result || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          >
            <option value="">Not played yet</option>
            <option value="W">Win</option>
            <option value="L">Loss</option>
            <option value="T">Tie</option>
          </select>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Our score
          </label>
          <input
            type="number"
            name="team_score"
            defaultValue={initialValues.team_score ?? ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Their score
          </label>
          <input
            type="number"
            name="opponent_score"
            defaultValue={initialValues.opponent_score ?? ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={initialValues.notes || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
