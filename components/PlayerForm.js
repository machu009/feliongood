"use client";

import { useState, useTransition, useEffect } from "react";

export default function PlayerForm({ initialValues = {}, action, submitLabel, programs = [] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [availablePrograms, setAvailablePrograms] = useState(programs);

  useEffect(() => {
    if (programs.length === 0) {
      // Fetch programs if not provided as props
      fetch("/api/programs")
        .then((res) => res.json())
        .then((data) => setAvailablePrograms(data.programs || []))
        .catch((err) => console.error("Failed to load programs", err));
    }
  }, [programs]);

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
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Program
        </label>
        <select
          name="program_id"
          defaultValue={initialValues.program_id || ""}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        >
          <option value="">Select a program</option>
          {availablePrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Full name
        </label>
        <input
          name="full_name"
          defaultValue={initialValues.full_name || ""}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Jersey #
          </label>
          <input
            name="jersey_number"
            defaultValue={initialValues.jersey_number || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Position
          </label>
          <input
            name="position"
            placeholder="e.g. SS, RHP"
            defaultValue={initialValues.position || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Grad year
          </label>
          <input
            type="number"
            name="grad_year"
            defaultValue={initialValues.grad_year || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Bats / Throws
          </label>
          <input
            name="bats_throws"
            placeholder="e.g. R/R"
            defaultValue={initialValues.bats_throws || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Height
          </label>
          <input
            name="height"
            placeholder={'e.g. 6\'1"'}
            defaultValue={initialValues.height || ""}
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

      <label className="flex items-center gap-2 font-mono text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialValues.is_active ?? true}
          className="h-4 w-4"
        />
        Active on roster
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
