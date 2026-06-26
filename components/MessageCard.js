"use client";

import { useState, useTransition } from "react";
import { respondToMessage, deleteMessage } from "@/lib/messages/actions";

export default function MessageCard({
  message,
  responses = [],
  onResponseSuccess,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSubmitReply(e) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await respondToMessage(
        message.id,
        replyText
      );

      if (res?.error) {
        setError(res.error);
      } else {
        setReplyText("");
        setIsReplying(false);
        onResponseSuccess?.();
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this message? This cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteMessage(message.id);
      if (res?.error) {
        setError(res.error);
      } else {
        onResponseSuccess?.();
      }
    });
  }

  return (
    <div className="border-2 border-ink/15 bg-white p-6">
      {/* Message Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-display text-lg tracking-wide">{message.sender_name}</p>
          <p className="font-mono text-xs text-ink/50">{message.sender_email}</p>
        </div>
        <span
          className={`stamp font-mono text-xs uppercase ${
            message.category === "join" ? "text-turf" : "text-ink/50"
          }`}
        >
          {message.category === "join" ? "Join Request" : "Contact"}
        </span>
      </div>

      {/* Original Message */}
      <p className="mt-4 text-sm text-ink/80">{message.message}</p>
      <p className="mt-2 font-mono text-xs text-ink/40">
        {new Date(message.created_at).toLocaleString()}
      </p>

      {/* Responses */}
      {responses.length > 0 && (
        <div className="mt-6 border-t-2 border-ink/10 pt-4">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/60 mb-3">
            Responses
          </p>
          {responses.map((response) => (
            <div key={response.id} className="mb-4 bg-turf/5 p-4">
              <p className="text-sm text-ink/80">{response.response_text}</p>
              <p className="mt-2 font-mono text-xs text-ink/40">
                {new Date(response.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {isReplying ? (
        <form onSubmit={handleSubmitReply} className="mt-6 space-y-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response..."
            rows={3}
            className="w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
            disabled={isPending}
          />
          {error && <p className="font-mono text-sm text-clay">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending || !replyText.trim()}
              className="bg-turf px-4 py-2 font-mono text-sm font-medium uppercase tracking-wide text-white hover:bg-turf/90 disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send Reply"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsReplying(false);
                setReplyText("");
                setError(null);
              }}
              disabled={isPending}
              className="border-2 border-ink/20 px-4 py-2 font-mono text-sm font-medium uppercase tracking-wide hover:bg-ink/5 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setIsReplying(true)}
            className="font-mono text-sm text-ink hover:text-clay"
          >
            REPLY
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="font-mono text-sm text-clay hover:text-clay/70 disabled:opacity-60"
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}
