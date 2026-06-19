"use client";

import { useState, useTransition } from "react";

export default function ProgramForm({ initialValues = {}, action, submitLabel }) {
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
