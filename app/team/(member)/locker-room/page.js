import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CoachMessages from "@/components/CoachMessages";

export const revalidate = 0;

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

export default async function LockerRoomPage() {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's messages with coach
  let userMessages = [];
  let messageResponses = {};

  if (user?.email) {
    const { data: messages } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("sender_email", user.email)
      .order("created_at", { ascending: false });

    if (messages && messages.length > 0) {
      userMessages = messages;

      // Fetch all responses for these messages
      const messageIds = messages.map((m) => m.id);
      const { data: responses } = await supabase
        .from("message_responses")
        .select("*")
        .in("message_id", messageIds)
        .order("created_at", { ascending: true });

      // Group responses by message_id
      messageResponses = (responses || []).reduce((acc, resp) => {
        if (!acc[resp.message_id]) {
          acc[resp.message_id] = [];
        }
        acc[resp.message_id].push(resp);
        return acc;
      }, {});
    }
  }

  // Fetch forum threads
  const { data: threads } = await supabase
    .from("forum_threads")
    .select("*, forum_replies(count)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
            Team Talk
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-wide">
            Locker Room
          </h1>
        </div>
        <Link
          href="/team/locker-room/new"
          className="bg-clay px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-clay/90"
        >
          + New Topic
        </Link>
      </div>

      {/* Coach Messages Section */}
      <div className="mt-12">
        <CoachMessages messages={userMessages} responses={messageResponses} />
      </div>

      {/* Forum Threads Section */}
      <div className="mt-8">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
          Public
        </p>
        <h2 className="mt-1 font-display text-2xl tracking-wide">
          Team Topics
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {(threads || []).map((thread) => {
          const replyCount = thread.forum_replies?.[0]?.count || 0;
          return (
            <Link
              key={thread.id}
              href={`/team/locker-room/${thread.id}`}
              className="block border-2 border-ink/15 bg-white p-4 hover:border-clay"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide">
                    {thread.title}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-ink/50">
                    {thread.author_name} &middot; {timeAgo(thread.created_at)}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-ink/50">
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </span>
              </div>
            </Link>
          );
        })}

        {(!threads || threads.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            No topics yet.{" "}
            <Link href="/team/locker-room/new" className="text-clay underline">
              Start the first one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
