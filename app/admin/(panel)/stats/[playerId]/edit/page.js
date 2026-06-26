import StatsForm from "@/components/StatsForm";
import { createClient } from "@/lib/supabase/server";
import { upsertBattingStats, upsertPitchingStats } from "../../actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditStatsPage({ params }) {
  const supabase = createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", params.playerId)
    .single();

  if (!player) notFound();

  const { data: battingStats } = await supabase
    .from("batting_stats")
    .select("*")
    .eq("player_id", params.playerId)
    .order("season", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: pitchingStats } = await supabase
    .from("pitching_stats")
    .select("*")
    .eq("player_id", params.playerId)
    .order("season", { ascending: false })
    .limit(1)
    .maybeSingle();

  const saveBatting = upsertBattingStats.bind(null, player.id);
  const savePitching = upsertPitchingStats.bind(null, player.id);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Player Stats</h1>
      <div className="mt-8">
        <StatsForm
          player={player}
          battingValues={battingStats || {}}
          pitchingValues={pitchingStats || {}}
          battingAction={saveBatting}
          pitchingAction={savePitching}
        />
      </div>
    </div>
  );
}
