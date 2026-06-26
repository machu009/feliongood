import { createClient } from "@/lib/supabase/server";
import MessageCard from "@/components/MessageCard";

export const revalidate = 0;

export default async function MessagesPage() {
  const supabase = createClient();

  // Fetch messages
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch all responses
  const { data: responses } = await supabase
    .from("message_responses")
    .select("*")
    .order("created_at", { ascending: true });

  // Group responses by message_id
  const responsesByMessage = (responses || []).reduce((acc, resp) => {
    if (!acc[resp.message_id]) {
      acc[resp.message_id] = [];
    }
    acc[resp.message_id].push(resp);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Messages</h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Contact &amp; join requests from the team section.
      </p>

      <div className="mt-8 space-y-6">
        {(messages || []).map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg}
            responses={responsesByMessage[msg.id] || []}
          />
        ))}

        {(!messages || messages.length === 0) && (
          <p className="font-mono text-sm text-ink/60">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
