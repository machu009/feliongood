import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CURRENT_SEASON } from "@/lib/season";

export const revalidate = 0;

export default async function StatsIndexPage() {
  const supabase = createClient();
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("full_name", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Stats — {CURRENT_SEASON} Season
      </h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Pick a player to enter their batting and pitching totals. The
        leaderboards page calculates AVG/OBP/SLG/OPS/ERA/WHIP automatically.
      </p>

      <div className="mt-8 space-y-3">
        {(players || []).map((player) => (
          <Link
            key={player.id}
            href={`/admin/stats/${player.id}`}
            className="flex items-center justify-between border-2 border-ink/15 bg-white p-4 hover:border-clay"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-clay">
                {player.jersey_number || "—"}
              </span>
              <p className="font-display text-xl tracking-wide">
                {player.full_name}
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-ink/50">
              {player.position || ""}
            </span>
          </Link>
        ))}

        {(!players || players.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            Add players to the{" "}
            <Link href="/admin/roster" className="text-clay underline">
              roster
            </Link>{" "}
            first.
          </p>
        )}
      </div>
    </div>
  );
}
