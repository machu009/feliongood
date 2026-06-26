import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

function formatAvg(hits, atBats) {
  if (!atBats || atBats === 0) return "—";
  return (hits / atBats).toFixed(3).replace(/^0/, "");
}

export default async function StatsPage() {
  const supabase = createClient();

  const { data: players } = await supabase
    .from("players")
    .select("id, full_name, jersey_number, position, profile_pic_url")
    .eq("is_active", true)
    .order("jersey_number", { ascending: true });

  const { data: battingStats } = await supabase
    .from("batting_stats")
    .select("player_id, season, games_played, hits, at_bats");

  const { data: pitchingStats } = await supabase
    .from("pitching_stats")
    .select("player_id, season, wins, losses, innings_pitched");

  const battingByPlayer = (battingStats || []).reduce((acc, s) => {
    acc[s.player_id] = s;
    return acc;
  }, {});

  const pitchingByPlayer = (pitchingStats || []).reduce((acc, s) => {
    acc[s.player_id] = s;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Stats</h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Select a player to enter or update their stats.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(players || []).map((player) => {
          const batting = battingByPlayer[player.id];
          const pitching = pitchingByPlayer[player.id];
          const hasStats = !!batting || !!pitching;

          return (
            <Link
              key={player.id}
              href={`/admin/stats/${player.id}/edit`}
              className="flex items-center gap-4 border-2 border-ink/15 bg-white p-4 hover:border-clay"
            >
              {player.profile_pic_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={player.profile_pic_url}
                  alt={player.full_name}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 object-cover border-2 border-ink/20"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 bg-ink/10 border-2 border-ink/20 flex items-center justify-center">
                  <span className="font-mono text-xs text-ink/50">
                    {player.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <span className="font-display text-2xl text-clay">
                {player.jersey_number || "—"}
              </span>

              <div className="flex-1">
                <p className="font-display text-lg tracking-wide">{player.full_name}</p>
                <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                  {player.position}
                  {batting ? ` · AVG ${formatAvg(batting.hits, batting.at_bats)}` : ""}
                  {pitching ? ` · ${pitching.wins || 0}-${pitching.losses || 0}` : ""}
                  {!hasStats ? " · No stats yet" : ""}
                </p>
              </div>

              <span className="font-mono text-xs uppercase tracking-wide text-clay shrink-0">
                {hasStats ? "Edit Stats" : "Add Stats"}
              </span>
            </Link>
          );
        })}

        {(!players || players.length === 0) && (
          <p className="font-mono text-sm text-ink/60">No active players found.</p>
        )}
      </div>
    </div>
  );
}
