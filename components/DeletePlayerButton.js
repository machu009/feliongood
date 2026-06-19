"use client";

import { useTransition } from "react";
import { deletePlayer } from "@/app/admin/(panel)/roster/actions";

export default function DeletePlayerButton({ playerId, playerName }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Remove ${playerName} from the roster?`)) return;
    startTransition(async () => {
      await deletePlayer(playerId);
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
