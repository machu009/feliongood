import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  formatAvg,
  formatObp,
  formatSlg,
  formatEra,
  formatWhip,
} from "@/lib/baseballStats";

export const revalidate = 0;

export default async function PlayerDetailPage({ params }) {
  const supabase = createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", params.playerId)
    .eq("is_active", true)
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

  const honors = player.honors
    ? player.honors.split(",").map((h) => h.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <Link
        href="/team/roster"
        className="font-mono text-xs uppercase tracking-wide text-ink/60 hover:text-ink"
      >
        ← Back to Roster
      </Link>

      {/* Player Header */}
      <div className="mt-6 flex items-start gap-6">
        {player.profile_pic_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.profile_pic_url}
            alt={player.full_name}
            width={120}
            height={120}
            className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 object-cover border-2 border-ink/20"
          />
        ) : (
          <div className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 bg-ink/10 border-2 border-ink/20 flex items-center justify-center">
            <span className="font-display text-3xl text-ink/40">
              {player.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-clay">
              {player.jersey_number || "—"}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl tracking-wide">
              {player.full_name}
            </h1>
          </div>

          {honors.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {honors.map((honor, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-clay/20 text-clay px-2.5 py-1 rounded-full font-mono text-xs font-medium uppercase tracking-wide"
                >
                  {honor}
                </span>
              ))}
            </div>
          )}

          <p className="mt-2 font-mono text-sm uppercase tracking-wide text-ink/60">
            {player.position || "—"}
            {player.grad_year ? ` · Class of ${player.grad_year}` : ""}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/50">
            {player.bats_throws ? `Bats/Throws: ${player.bats_throws}` : ""}
            {player.height ? ` · Height: ${player.height}` : ""}
            {player.weight ? ` · Weight: ${player.weight} lbs` : ""}
          </p>
        </div>
      </div>

      {/* Batting Stats */}
      {battingStats && (
        <div className="mt-10">
          <h2 className="font-mono text-sm uppercase tracking-wide text-clay mb-3">
            Batting · {battingStats.season}
          </h2>
          <div className="overflow-x-auto border-2 border-ink/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/15 bg-ink/5">
                  {["G", "AB", "R", "H", "2B", "3B", "HR", "RBI", "BB", "SO", "SB", "AVG", "OBP", "SLG"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink/60"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="text-center font-mono">
                  <td className="px-3 py-2">{battingStats.games_played || 0}</td>
                  <td className="px-3 py-2">{battingStats.at_bats || 0}</td>
                  <td className="px-3 py-2">{battingStats.runs || 0}</td>
                  <td className="px-3 py-2">{battingStats.hits || 0}</td>
                  <td className="px-3 py-2">{battingStats.doubles || 0}</td>
                  <td className="px-3 py-2">{battingStats.triples || 0}</td>
                  <td className="px-3 py-2">{battingStats.home_runs || 0}</td>
                  <td className="px-3 py-2">{battingStats.rbi || 0}</td>
                  <td className="px-3 py-2">{battingStats.walks || 0}</td>
                  <td className="px-3 py-2">{battingStats.strikeouts || 0}</td>
                  <td className="px-3 py-2">{battingStats.stolen_bases || 0}</td>
                  <td className="px-3 py-2 font-medium text-clay">
                    {formatAvg(battingStats.hits, battingStats.at_bats)}
                  </td>
                  <td className="px-3 py-2">
                    {formatObp(
                      battingStats.hits,
                      battingStats.walks,
                      battingStats.hit_by_pitch,
                      battingStats.at_bats
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {formatSlg(
                      battingStats.hits,
                      battingStats.doubles,
                      battingStats.triples,
                      battingStats.home_runs,
                      battingStats.at_bats
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pitching Stats */}
      {pitchingStats && (
        <div className="mt-10">
          <h2 className="font-mono text-sm uppercase tracking-wide text-clay mb-3">
            Pitching · {pitchingStats.season}
          </h2>
          <div className="overflow-x-auto border-2 border-ink/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/15 bg-ink/5">
                  {["APP", "W", "L", "SV", "IP", "H", "R", "ER", "BB", "SO", "ERA", "WHIP"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink/60"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="text-center font-mono">
                  <td className="px-3 py-2">{pitchingStats.appearances || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.wins || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.losses || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.saves || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.innings_pitched || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.hits_allowed || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.runs_allowed || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.earned_runs || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.walks_allowed || 0}</td>
                  <td className="px-3 py-2">{pitchingStats.strikeouts || 0}</td>
                  <td className="px-3 py-2 font-medium text-clay">
                    {formatEra(pitchingStats.earned_runs, pitchingStats.innings_pitched)}
                  </td>
                  <td className="px-3 py-2">
                    {formatWhip(
                      pitchingStats.walks_allowed,
                      pitchingStats.hits_allowed,
                      pitchingStats.innings_pitched
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!battingStats && !pitchingStats && (
        <p className="mt-10 font-mono text-sm text-ink/60">
          No stats available yet for this season.
        </p>
      )}
    </div>
  );
}
