"use client";

import { useState, useTransition } from "react";
import { upsertBattingStats } from "../actions";
import { battingAverage, onBasePlusSlugging, formatRate } from "@/lib/baseball-stats";

const FIELDS = [
  ["games_played", "Games"],
  ["at_bats", "At Bats"],
  ["runs", "Runs"],
  ["hits", "Hits"],
  ["doubles", "Doubles"],
  ["triples", "Triples"],
  ["home_runs", "Home Runs"],
  ["rbi", "RBI"],
  ["walks", "Walks"],
  ["strikeouts", "Strikeouts"],
  ["stolen_bases", "Stolen Bases"],
  ["hit_by_pitch", "Hit By Pitch"],
];

export default function BattingStatsForm({ playerId, season, initialValues }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [values, setValues] = useState(initialValues);

  const action = upsertBattingStats.bind(null, playerId, season);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const next = {};
    FIELDS.forEach(([key]) => {
      next[key] = Number(formData.get(key) || 0);
    });
    setValues(next);
    setResult(null);
    startTransition(async () => {
      const res = await action(formData);
      setResult(res);
    });
  }

  return (
    <div>
      <h2 className="font-display text-2xl tracking-wide">Batting</h2>
      <p className="mt-1 font-mono text-xs text-ink/50">
        AVG {formatRate(battingAverage(values))} · OPS{" "}
        {formatRate(onBasePlusSlugging(values))}
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className="font-mono text-xs uppercase tracking-wide text-ink/60">
                {label}
              </label>
              <input
                type="number"
                name={key}
                defaultValue={initialValues[key] ?? 0}
                min={0}
                className="mt-1 w-full border-2 border-ink/20 bg-chalk p-2 text-sm focus:border-clay focus:outline-none"
              />
            </div>
          ))}
        </div>

        {result?.error ? (
          <p className="mt-3 font-mono text-sm text-clay">{result.error}</p>
        ) : null}
        {result?.success ? (
          <p className="mt-3 font-mono text-sm text-turf">Saved.</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 bg-ink px-6 py-2.5 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save Batting Stats"}
        </button>
      </form>
    </div>
  );
}
