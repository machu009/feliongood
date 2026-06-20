"use client";

import { useTransition } from "react";
import { deleteReply } from "@/app/team/(member)/locker-room/actions";

export default function DeleteReplyButton({ replyId, threadId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this reply?")) return;
    startTransition(async () => {
      await deleteReply(replyId, threadId);
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
