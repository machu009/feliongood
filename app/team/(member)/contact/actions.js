"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendContactMessage(formData) {
  const supabase = createClient();

  const senderName = formData.get("sender_name")?.toString().trim();
  const senderEmail = formData.get("sender_email")?.toString().trim();
  const category = formData.get("category")?.toString() || "contact";
  const message = formData.get("message")?.toString().trim();

  if (!senderName || !senderEmail || !message) {
    return { error: "Please fill in your name, email, and a message." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    sender_name: senderName,
    sender_email: senderEmail,
    category,
    message,
  });

  if (error) {
    return { error: "Could not send your message. Please try again." };
  }

  return { success: true };
}
