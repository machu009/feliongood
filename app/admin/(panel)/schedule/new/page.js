// app/(panel)/schedule/new/page.js
import GameForm from "@/components/GameForm";
import { createGame } from "../actions";
import Link from "next/link";

export default function NewGamePage({ searchParams }) {
  const programId = searchParams?.program;

  if (!programId) {
    return (
      <div>
        <h1 className="font-display text-4xl tracking-wide mb-4">Add Game</h1>
        <p className="font-mono text-sm text-ink/60 mb-6">
          Please select a team from the schedule page first.
        </p>
        <Link
          href="/admin/schedule"
          className="text-clay underline font-mono text-sm"
        >
          ← Back to Schedule
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Add Game</h1>
      <div className="mt-8">
        <GameForm action={createGame} submitLabel="Add Game" programId={programId} />
      </div>
    </div>
  );
}
