"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCalendarUrl(formData) {
  const supabase = createClient();
  const url = formData.get("google_calendar_embed_url")?.toString().trim() || "";

  const { error } = await supabase
    .from("team_settings")
    .update({ google_calendar_embed_url: url, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return { error: "Could not save the calendar link." };
  }

  revalidatePath("/team/calendar");
  return { success: true };
}

export async function uploadRulebook(formData) {
  const supabase = createClient();
  const file = formData.get("file");

  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Choose a PDF file first." };
  }

  const path = `rulebook-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("team-docs")
    .upload(path, file, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    return { error: "Could not upload the file. Please try again." };
  }

  const { error } = await supabase
    .from("team_settings")
    .update({
      rulebook_path: path,
      rulebook_filename: file.name || "Team Rule Book.pdf",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { error: "Uploaded the file but could not save the reference." };
  }

  revalidatePath("/team/rules");
  return { success: true };
}
