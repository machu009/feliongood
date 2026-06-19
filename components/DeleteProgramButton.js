"use client";

import { useTransition } from "react";
import { deleteProgram } from "@/app/admin/(panel)/programs/actions";

export default function DeleteProgramButton({ programId, programName }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `Delete "${programName}"? This also deletes any sign-ups for it. This can't be undone.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteProgram(programId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="font-mono text-xs uppercase tracking-wide text-clay hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
