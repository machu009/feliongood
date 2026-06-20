"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAuthorName(supabase, userId, fallbackEmail) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();
  return profile?.full_name || fallbackEmail || "Team Member";
}

export async function createThread(formData) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return { error: "Not signed in." };

  const title = formData.get("title")?.toString().trim();
  const body = formData.get("body")?.toString().trim();

  if (!title || !body) {
    return { error: "Please add a title and a message." };
  }

  const authorName = await getAuthorName(supabase, data.user.id, data.user.email);

  const { data: thread, error } = await supabase
    .from("forum_threads")
    .insert({
      author_id: data.user.id,
      author_name: authorName,
      title,
      body,
    })
    .select()
    .single();

  if (error || !thread) {
    return { error: "Could not post your topic. Please try again." };
  }

  revalidatePath("/team/locker-room");
  redirect(`/team/locker-room/${thread.id}`);
}

export async function createReply(threadId, formData) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return { error: "Not signed in." };

  const body = formData.get("body")?.toString().trim();
  if (!body) {
    return { error: "Write a reply first." };
  }

  const authorName = await getAuthorName(supabase, data.user.id, data.user.email);

  const { error } = await supabase.from("forum_replies").insert({
    thread_id: threadId,
    author_id: data.user.id,
    author_name: authorName,
    body,
  });

  if (error) {
    return { error: "Could not post your reply. Please try again." };
  }

  revalidatePath(`/team/locker-room/${threadId}`);
  return { success: true };
}

export async function deleteThread(threadId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("forum_threads")
    .delete()
    .eq("id", threadId);

  if (error) {
    return { error: "Could not delete this topic." };
  }

  revalidatePath("/team/locker-room");
  redirect("/team/locker-room");
}

export async function deleteReply(replyId, threadId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("forum_replies")
    .delete()
    .eq("id", replyId);

  if (error) {
    return { error: "Could not delete this reply." };
  }

  revalidatePath(`/team/locker-room/${threadId}`);
  return { success: true };
}
