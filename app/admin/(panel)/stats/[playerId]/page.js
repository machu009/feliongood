import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CURRENT_SEASON } from "@/lib/season";
import BattingStatsForm from "./BattingStatsForm";
import PitchingStatsForm from "./PitchingStatsForm";

export const revalidate = 0;

const EMPTY_BATTING = {
  games_played: 0,
  at_bats: 0,
  runs: 0,
  hits: 0,
  doubles: 0,
  triples: 0,
  home_runs: 0,
  rbi: 0,
  walks: 0,
  strikeouts: 0,
  stolen_bases: 0,
  hit_by_pitch: 0,
};

const EMPTY_PITCHING = {
  appearances: 0,
  wins: 0,
  losses: 0,
  saves: 0,
  innings_pitched: 0,
  hits_allowed: 0,
  runs_allowed: 0,
  earned_runs: 0,
  walks_allowed: 0,
  strikeouts: 0,
  hit_batters: 0,
};

export default async function PlayerStatsPage({ params }) {
  const supabase = createClient();

  const [{ data: player }, { data: batting }, { data: pitching }] =
    await Promise.all([
      supabase.from("players").select("*").eq("id", params.playerId).single(),
      supabase
        .from("batting_stats")
        .select("*")
        .eq("player_id", params.playerId)
        .eq("season", CURRENT_SEASON)
        .maybeSingle(),
      supabase
        .from("pitching_stats")
        .select("*")
        .eq("player_id", params.playerId)
        .eq("season", CURRENT_SEASON)
        .maybeSingle(),
    ]);

  if (!player) notFound();

  return (
    <div>
      <Link
        href="/admin/stats"
        className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink"
      >
        ← Back to Players
      </Link>
      <h1 className="mt-3 font-display text-4xl tracking-wide">
        {player.full_name}
      </h1>
      <p className="font-mono text-sm text-ink/60">
        {CURRENT_SEASON} Season Totals
      </p>

      <div className="mt-10 space-y-12">
        <BattingStatsForm
          playerId={player.id}
          season={CURRENT_SEASON}
          initialValues={batting || EMPTY_BATTING}
        />
        <div className="stitch-divider" />
        <PitchingStatsForm
          playerId={player.id}
          season={CURRENT_SEASON}
          initialValues={pitching || EMPTY_PITCHING}
        />
      </div>
    </div>
  );
}
