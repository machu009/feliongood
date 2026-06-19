"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSignup(programId, formData) {
  const supabase = createClient();

  const parentName = formData.get("parentName")?.toString().trim();
  const playerName = formData.get("playerName")?.toString().trim();
  const playerAge = formData.get("playerAge")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();

  if (!parentName || !playerName || !email) {
    return { error: "Please fill in parent name, player name, and email." };
  }

  const { error } = await supabase.from("signups").insert({
    program_id: programId,
    parent_name: parentName,
    player_name: playerName,
    player_age: playerAge ? parseInt(playerAge, 10) : null,
    email,
    phone: phone || "",
    notes: notes || "",
  });

  if (error) {
    return { error: "Something went wrong submitting the form. Please try again." };
  }

  revalidatePath("/admin");
  return { success: true };
}
