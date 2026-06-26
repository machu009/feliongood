"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readBattingFields(formData) {
  const num = (key) => {
    const val = formData.get(key);
    return val ? Number(val) : 0;
  };

  return {
    season: formData.get("season")?.toString().trim() || "2026",
    games_played: num("games_played"),
    at_bats: num("at_bats"),
    runs: num("runs"),
    hits: num("hits"),
    doubles: num("doubles"),
    triples: num("triples"),
    home_runs: num("home_runs"),
    rbi: num("rbi"),
    walks: num("walks"),
    strikeouts: num("strikeouts"),
    stolen_bases: num("stolen_bases"),
    hit_by_pitch: num("hit_by_pitch"),
  };
}

function readPitchingFields(formData) {
  const num = (key) => {
    const val = formData.get(key);
    return val ? Number(val) : 0;
  };

  return {
    season: formData.get("season")?.toString().trim() || "2026",
    appearances: num("appearances"),
    wins: num("wins"),
    losses: num("losses"),
    saves: num("saves"),
    innings_pitched: num("innings_pitched"),
    hits_allowed: num("hits_allowed"),
    runs_allowed: num("runs_allowed"),
    earned_runs: num("earned_runs"),
    walks_allowed: num("walks_allowed"),
    strikeouts: num("strikeouts"),
    hit_batters: num("hit_batters"),
  };
}

export async function upsertBattingStats(playerId, formData) {
  const supabase = createClient();
  const fields = readBattingFields(formData);

  const { error } = await supabase
    .from("batting_stats")
    .upsert(
      {
        player_id: playerId,
        ...fields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "player_id,season" }
    );

  if (error) {
    console.error("Error saving batting stats:", error);
    return { error: "Could not save batting stats. Please try again." };
  }

  revalidatePath("/admin/stats");
  revalidatePath("/admin/roster");
  revalidatePath("/team/roster");
  redirect("/admin/stats");
}

export async function upsertPitchingStats(playerId, formData) {
  const supabase = createClient();
  const fields = readPitchingFields(formData);

  const { error } = await supabase
    .from("pitching_stats")
    .upsert(
      {
        player_id: playerId,
        ...fields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "player_id,season" }
    );

  if (error) {
    console.error("Error saving pitching stats:", error);
    return { error: "Could not save pitching stats. Please try again." };
  }

  revalidatePath("/admin/stats");
  revalidatePath("/admin/roster");
  revalidatePath("/team/roster");
  redirect("/admin/stats");
}
