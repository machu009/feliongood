"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function num(formData, key) {
  const val = formData.get(key);
  if (val === null || val === "") return 0;
  return Number(val);
}

export async function upsertBattingStats(playerId, season, formData) {
  const supabase = createClient();

  const fields = {
    player_id: playerId,
    season,
    games_played: num(formData, "games_played"),
    at_bats: num(formData, "at_bats"),
    runs: num(formData, "runs"),
    hits: num(formData, "hits"),
    doubles: num(formData, "doubles"),
    triples: num(formData, "triples"),
    home_runs: num(formData, "home_runs"),
    rbi: num(formData, "rbi"),
    walks: num(formData, "walks"),
    strikeouts: num(formData, "strikeouts"),
    stolen_bases: num(formData, "stolen_bases"),
    hit_by_pitch: num(formData, "hit_by_pitch"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("batting_stats")
    .upsert(fields, { onConflict: "player_id,season" });

  if (error) {
    return { error: "Could not save batting stats." };
  }

  revalidatePath("/admin/stats");
  revalidatePath("/team/leaderboards");
  return { success: true };
}

export async function upsertPitchingStats(playerId, season, formData) {
  const supabase = createClient();

  const fields = {
    player_id: playerId,
    season,
    appearances: num(formData, "appearances"),
    wins: num(formData, "wins"),
    losses: num(formData, "losses"),
    saves: num(formData, "saves"),
    innings_pitched: num(formData, "innings_pitched"),
    hits_allowed: num(formData, "hits_allowed"),
    runs_allowed: num(formData, "runs_allowed"),
    earned_runs: num(formData, "earned_runs"),
    walks_allowed: num(formData, "walks_allowed"),
    strikeouts: num(formData, "strikeouts"),
    hit_batters: num(formData, "hit_batters"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("pitching_stats")
    .upsert(fields, { onConflict: "player_id,season" });

  if (error) {
    return { error: "Could not save pitching stats." };
  }

  revalidatePath("/admin/stats");
  revalidatePath("/team/leaderboards");
  return { success: true };
}
