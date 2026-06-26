"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function respondToMessage(messageId, responseText) {
  const supabase = createClient();

  try {
    if (!responseText?.trim()) {
      return { error: "Response cannot be empty." };
    }

    // Save response to database
    const { error: dbError } = await supabase.from("message_responses").insert({
      message_id: messageId,
      response_text: responseText.trim(),
    });

    if (dbError) {
      return { error: "Failed to save response. Please try again." };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteMessage(messageId) {
  const supabase = createClient();

  try {
    // Delete message (responses will cascade delete due to ON DELETE CASCADE)
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      return { error: "Failed to delete message. Please try again." };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
