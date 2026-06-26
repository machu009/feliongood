"use client";

import { useState, useTransition } from "react";

function StatInput({ name, label, defaultValue, step }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
        {label}
      </label>
      <input
        type="number"
        step={step || "1"}
        name={name}
        defaultValue={defaultValue || 0}
        className="mt-1 w-full border-2 border-ink/20 bg-chalk p-2.5 text-sm focus:border-clay focus:outline-none"
      />
    </div>
  );
}

export default function StatsForm({
  player,
  battingValues = {},
  pitchingValues = {},
  battingAction,
  pitchingAction,
}) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3 border-b-2 border-ink/15 pb-4">
        <span className="font-display text-2xl text-clay">
          {player.jersey_number || "—"}
        </span>
        <h2 className="font-display text-2xl tracking-wide">{player.full_name}</h2>
      </div>

      <BattingForm player={player} initialValues={battingValues} action={battingAction} />
      <PitchingForm player={player} initialValues={pitchingValues} action={pitchingAction} />
    </div>
  );
}

function BattingForm({ initialValues, action }) {
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
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      <h3 className="font-mono text-sm uppercase tracking-wide text-clay">Batting</h3>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Season
        </label>
        <input
          name="season"
          defaultValue={initialValues.season || "2026"}
          className="mt-1 w-full max-w-xs border-2 border-ink/20 bg-chalk p-2.5 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
        <StatInput name="games_played" label="Games" defaultValue={initialValues.games_played} />
        <StatInput name="at_bats" label="At Bats" defaultValue={initialValues.at_bats} />
        <StatInput name="runs" label="Runs" defaultValue={initialValues.runs} />
        <StatInput name="hits" label="Hits" defaultValue={initialValues.hits} />
        <StatInput name="doubles" label="2B" defaultValue={initialValues.doubles} />
        <StatInput name="triples" label="3B" defaultValue={initialValues.triples} />
        <StatInput name="home_runs" label="HR" defaultValue={initialValues.home_runs} />
        <StatInput name="rbi" label="RBI" defaultValue={initialValues.rbi} />
        <StatInput name="walks" label="Walks" defaultValue={initialValues.walks} />
        <StatInput name="strikeouts" label="Strikeouts" defaultValue={initialValues.strikeouts} />
        <StatInput name="stolen_bases" label="Stolen Bases" defaultValue={initialValues.stolen_bases} />
        <StatInput name="hit_by_pitch" label="Hit By Pitch" defaultValue={initialValues.hit_by_pitch} />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Batting Stats"}
      </button>
    </form>
  );
}

function PitchingForm({ initialValues, action }) {
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
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      <h3 className="font-mono text-sm uppercase tracking-wide text-clay">Pitching</h3>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Season
        </label>
        <input
          name="season"
          defaultValue={initialValues.season || "2026"}
          className="mt-1 w-full max-w-xs border-2 border-ink/20 bg-chalk p-2.5 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
        <StatInput name="appearances" label="Appearances" defaultValue={initialValues.appearances} />
        <StatInput name="wins" label="Wins" defaultValue={initialValues.wins} />
        <StatInput name="losses" label="Losses" defaultValue={initialValues.losses} />
        <StatInput name="saves" label="Saves" defaultValue={initialValues.saves} />
        <StatInput
          name="innings_pitched"
          label="Innings Pitched"
          defaultValue={initialValues.innings_pitched}
          step="0.1"
        />
        <StatInput name="hits_allowed" label="Hits Allowed" defaultValue={initialValues.hits_allowed} />
        <StatInput name="runs_allowed" label="Runs Allowed" defaultValue={initialValues.runs_allowed} />
        <StatInput name="earned_runs" label="Earned Runs" defaultValue={initialValues.earned_runs} />
        <StatInput name="walks_allowed" label="Walks Allowed" defaultValue={initialValues.walks_allowed} />
        <StatInput name="strikeouts" label="Strikeouts" defaultValue={initialValues.strikeouts} />
        <StatInput name="hit_batters" label="Hit Batters" defaultValue={initialValues.hit_batters} />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Pitching Stats"}
      </button>
    </form>
  );
}
