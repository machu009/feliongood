"use client";

import { useTransition } from "react";
import { deleteGame } from "@/app/admin/(panel)/schedule/actions";

export default function DeleteGameButton({ gameId, opponent }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Remove the game vs ${opponent}?`)) return;
    startTransition(async () => {
      await deleteGame(gameId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="font-mono text-xs uppercase tracking-wide text-clay hover:underline disabled:opacity-50"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
