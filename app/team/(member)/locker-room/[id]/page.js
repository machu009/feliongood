import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReplyForm from "./ReplyForm";
import DeleteThreadButton from "@/components/DeleteThreadButton";
import DeleteReplyButton from "@/components/DeleteReplyButton";

export const revalidate = 0;

function formatDateTime(d) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function ThreadPage({ params }) {
  const supabase = createClient();

  const [{ data: thread }, { data: replies }, { data: userData }] =
    await Promise.all([
      supabase.from("forum_threads").select("*").eq("id", params.id).single(),
      supabase
        .from("forum_replies")
        .select("*")
        .eq("thread_id", params.id)
        .order("created_at", { ascending: true }),
      supabase.auth.getUser(),
    ]);

  if (!thread) notFound();

  let isAdmin = false;
  const userId = userData?.user?.id;
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const canDeleteThread = isAdmin || userId === thread.author_id;

  return (
    <div>
      <Link
        href="/team/locker-room"
        className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink"
      >
        ← Back to Locker Room
      </Link>

      <div className="mt-4 border-2 border-ink bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl tracking-wide">
            {thread.title}
          </h1>
          {canDeleteThread ? <DeleteThreadButton threadId={thread.id} /> : null}
        </div>
        <p className="mt-1 font-mono text-xs text-ink/50">
          {thread.author_name} &middot; {formatDateTime(thread.created_at)}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-ink/85">{thread.body}</p>
      </div>

      <div className="mt-6 space-y-4">
        {(replies || []).map((reply) => {
          const canDeleteReply = isAdmin || userId === reply.author_id;
          return (
            <div
              key={reply.id}
              className="border-2 border-ink/15 bg-white p-4 sm:ml-8"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs text-ink/50">
                  {reply.author_name} &middot; {formatDateTime(reply.created_at)}
                </p>
                {canDeleteReply ? (
                  <DeleteReplyButton replyId={reply.id} threadId={thread.id} />
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink/85">
                {reply.body}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:ml-8">
        <h2 className="font-display text-xl tracking-wide">Reply</h2>
        <div className="mt-3">
          <ReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
