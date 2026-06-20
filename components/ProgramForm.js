"use client";

import { useState, useTransition } from "react";

export default function ProgramForm({ initialValues = {}, action, submitLabel }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [format, setFormat] = useState(initialValues.format || "season");

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Program name
        </label>
        <input
          name="name"
          defaultValue={initialValues.name || ""}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Type
        </label>
        <select
          name="type"
          defaultValue={initialValues.type || "camp"}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        >
          <option value="camp">Camp</option>
          <option value="lesson">Private/Group Lesson</option>
          <option value="team">Team</option>
          <option value="clinic">Clinic</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialValues.description || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
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

      {/* Format toggle */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Format
        </label>
        <input type="hidden" name="format" value={format} />
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => setFormat("season")}
            className={`flex-1 border-2 px-4 py-2.5 font-mono text-sm uppercase tracking-wide ${
              format === "season"
                ? "border-ink bg-ink text-chalk"
                : "border-ink/20 text-ink/70 hover:border-ink/40"
            }`}
          >
            Season / Multi-Day
          </button>
          <button
            type="button"
            onClick={() => setFormat("clinic")}
            className={`flex-1 border-2 px-4 py-2.5 font-mono text-sm uppercase tracking-wide ${
              format === "clinic"
                ? "border-ink bg-ink text-chalk"
                : "border-ink/20 text-ink/70 hover:border-ink/40"
            }`}
          >
            One-Day Clinic
          </button>
        </div>
        <p className="mt-1 font-mono text-xs text-ink/50">
          {format === "season"
            ? "Spans a date range — good for camps, lessons, and team seasons."
            : "A single day with a specific start/end time — good for one-off clinics."}
        </p>
      </div>

      {format === "season" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Start date
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={initialValues.start_date || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              End date
            </label>
            <input
              type="date"
              name="end_date"
              defaultValue={initialValues.end_date || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Sign-up deadline
            </label>
            <input
              type="date"
              name="signup_deadline"
              defaultValue={initialValues.signup_deadline || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Date
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={initialValues.start_date || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Start time
            </label>
            <input
              type="text"
              name="start_time"
              placeholder="9:00 AM"
              defaultValue={initialValues.start_time || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              End time
            </label>
            <input
              type="text"
              name="end_time"
              placeholder="12:00 PM"
              defaultValue={initialValues.end_time || ""}
              className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Sign-up deadline (optional)
            </label>
            <input
              type="date"
              name="signup_deadline"
              defaultValue={initialValues.signup_deadline || ""}
              className="mt-1 w-full max-w-xs border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            />
          </div>
        </div>
      )}

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Capacity (optional)
        </label>
        <input
          type="number"
          name="capacity"
          defaultValue={initialValues.capacity || ""}
          className="mt-1 w-32 border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 font-mono text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialValues.is_active ?? true}
          className="h-4 w-4"
        />
        Visible on the public site
      </label>

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
