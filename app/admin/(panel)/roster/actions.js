"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readPlayerFields(formData) {
  return {
    full_name: formData.get("full_name")?.toString().trim() || "",
    jersey_number: formData.get("jersey_number")?.toString().trim() || "",
    position: formData.get("position")?.toString().trim() || "",
    grad_year: formData.get("grad_year")
      ? parseInt(formData.get("grad_year"), 10)
      : null,
    bats_throws: formData.get("bats_throws")?.toString().trim() || "",
    height: formData.get("height")?.toString().trim() || "",
    notes: formData.get("notes")?.toString().trim() || "",
    is_active: formData.get("is_active") === "on",
    program_id: formData.get("program_id")?.toString().trim() || null,
  };
}

export async function createPlayer(formData) {
  const supabase = createClient();
  const fields = readPlayerFields(formData);

  if (!fields.full_name) {
    return { error: "Player name is required." };
  }

  if (!fields.program_id) {
    return { error: "Please select a program." };
  }

  const { error } = await supabase.from("players").insert(fields);

  if (error) {
    return { error: "Could not add the player. Please try again." };
  }

  revalidatePath("/admin/roster");
  revalidatePath("/team/roster");
  redirect("/admin/roster");
}

export async function updatePlayer(playerId, formData) {
  const supabase = createClient();
  const fields = readPlayerFields(formData);

  if (!fields.full_name) {
    return { error: "Player name is required." };
  }

  if (!fields.program_id) {
    return { error: "Please select a program." };
  }

  const { error } = await supabase
    .from("players")
    .update(fields)
    .eq("id", playerId);

  if (error) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/roster");
  revalidatePath("/team/roster");
  redirect("/admin/roster");
}

export async function deletePlayer(playerId) {
  const supabase = createClient();
  await supabase.from("players").delete().eq("id", playerId);

  revalidatePath("/admin/roster");
  revalidatePath("/team/roster");
}
