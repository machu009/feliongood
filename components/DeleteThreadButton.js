"use client";

import { useTransition } from "react";
import { deleteThread } from "@/app/team/(member)/locker-room/actions";

export default function DeleteThreadButton({ threadId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this whole topic, including all replies?")) return;
    startTransition(async () => {
      await deleteThread(threadId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="font-mono text-xs uppercase tracking-wide text-clay hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete Topic"}
    </button>
  );
}
