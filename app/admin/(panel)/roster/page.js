import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeletePlayerButton from "@/components/DeletePlayerButton";

export const revalidate = 0;

export default async function RosterPage() {
  const supabase = createClient();
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("full_name", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Roster</h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            {players?.length || 0} players
          </p>
        </div>
        <Link
          href="/admin/roster/new"
          className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-ink/90"
        >
          + Add Player
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {(players || []).map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between border-2 border-ink/15 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-clay">
                  {player.jersey_number || "—"}
                </span>
                <p className="font-display text-xl tracking-wide">
                  {player.full_name}
                </p>
                {!player.is_active ? (
                  <span className="stamp font-mono text-xs uppercase text-ink/40">
                    Inactive
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                {player.position || "—"}
                {player.grad_year ? ` · Class of ${player.grad_year}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href={`/admin/roster/${player.id}/edit`}
                className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeletePlayerButton
                playerId={player.id}
                playerName={player.full_name}
              />
            </div>
          </div>
        ))}

        {(!players || players.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            No players yet.{" "}
            <Link href="/admin/roster/new" className="text-clay underline">
              Add your first player
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
