import Link from "next/link";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function CoachMessages({ messages = [], responses = {} }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-turf">
          Direct
        </p>
        <h2 className="mt-1 font-display text-2xl tracking-wide">
          Messages with Coach
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => {
          const messageResponses = responses[message.id] || [];
          const hasReply = messageResponses.length > 0;

          return (
            <div
              key={message.id}
              className="border-2 border-ink/15 bg-white p-4"
            >
              {/* Original Message */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-display text-sm font-medium">
                    Your Message
                  </p>
                  <p className="mt-1 text-sm text-ink/80">{message.message}</p>
                  <p className="mt-2 font-mono text-xs text-ink/40">
                    {timeAgo(message.created_at)}
                  </p>
                </div>
                {hasReply && (
                  <span className="shrink-0 rounded bg-turf/10 px-2 py-1 font-mono text-xs uppercase tracking-wide text-turf">
                    Replied
                  </span>
                )}
              </div>

              {/* Coach Responses */}
              {messageResponses.length > 0 && (
                <div className="mt-4 border-t-2 border-ink/10 pt-4">
                  {messageResponses.map((response) => (
                    <div key={response.id} className="bg-turf/5 p-3">
                      <p className="font-mono text-xs uppercase tracking-wide text-turf font-medium">
                        Coach Felion
                      </p>
                      <p className="mt-2 text-sm text-ink/80">
                        {response.response_text}
                      </p>
                      <p className="mt-2 font-mono text-xs text-ink/40">
                        {timeAgo(response.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {!hasReply && (
                <div className="mt-3 border-t-2 border-ink/10 pt-3">
                  <p className="font-mono text-xs text-ink/50">
                    Waiting for coach response...
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
