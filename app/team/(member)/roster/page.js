import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function TeamRosterPage() {
  const supabase = createClient();
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("full_name", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Roster</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(players || []).map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-4 border-2 border-ink/15 bg-white p-4"
          >
            <span className="font-display text-3xl text-clay">
              {player.jersey_number || "—"}
            </span>
            <div>
              <p className="font-display text-xl tracking-wide">
                {player.full_name}
              </p>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                {player.position || ""}
                {player.grad_year ? ` · Class of ${player.grad_year}` : ""}
                {player.bats_throws ? ` · ${player.bats_throws}` : ""}
              </p>
            </div>
          </div>
        ))}

        {(!players || players.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            Roster coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
