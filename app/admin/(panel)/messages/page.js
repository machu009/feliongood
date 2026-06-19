import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function MessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Messages</h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Contact &amp; join requests from the team section.
      </p>

      <div className="mt-8 space-y-4">
        {(messages || []).map((msg) => (
          <div
            key={msg.id}
            className="border-2 border-ink/15 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg tracking-wide">
                {msg.sender_name}
              </p>
              <span
                className={`stamp font-mono text-xs uppercase ${
                  msg.category === "join" ? "text-turf" : "text-ink/50"
                }`}
              >
                {msg.category === "join" ? "Join Request" : "Contact"}
              </span>
            </div>
            <p className="font-mono text-xs text-ink/50">{msg.sender_email}</p>
            <p className="mt-3 text-sm text-ink/80">{msg.message}</p>
            <p className="mt-2 font-mono text-xs text-ink/40">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {(!messages || messages.length === 0) && (
          <p className="font-mono text-sm text-ink/60">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
