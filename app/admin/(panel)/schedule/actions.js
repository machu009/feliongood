"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readGameFields(formData) {
  return {
    opponent: formData.get("opponent")?.toString().trim() || "",
    game_date: formData.get("game_date")?.toString() || null,
    game_time: formData.get("game_time")?.toString().trim() || "",
    location: formData.get("location")?.toString().trim() || "",
    is_home: formData.get("is_home") === "on",
    result: formData.get("result")?.toString() || null,
    team_score: formData.get("team_score")
      ? parseInt(formData.get("team_score"), 10)
      : null,
    opponent_score: formData.get("opponent_score")
      ? parseInt(formData.get("opponent_score"), 10)
      : null,
    notes: formData.get("notes")?.toString().trim() || "",
  };
}

export async function createGame(formData) {
  const supabase = createClient();
  const fields = readGameFields(formData);

  if (!fields.opponent || !fields.game_date) {
    return { error: "Opponent and date are required." };
  }

  const { error } = await supabase.from("games").insert(fields);

  if (error) {
    return { error: "Could not add the game. Please try again." };
  }

  revalidatePath("/admin/schedule");
  revalidatePath("/team/schedule");
  redirect("/admin/schedule");
}

export async function updateGame(gameId, formData) {
  const supabase = createClient();
  const fields = readGameFields(formData);

  if (!fields.opponent || !fields.game_date) {
    return { error: "Opponent and date are required." };
  }

  const { error } = await supabase
    .from("games")
    .update(fields)
    .eq("id", gameId);

  if (error) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/schedule");
  revalidatePath("/team/schedule");
  redirect("/admin/schedule");
}

export async function deleteGame(gameId) {
  const supabase = createClient();
  await supabase.from("games").delete().eq("id", gameId);

  revalidatePath("/admin/schedule");
  revalidatePath("/team/schedule");
}
