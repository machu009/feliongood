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
        {(players || []).map((player) => {
          const honors = player.honors
            ? player.honors.split(",").map((h) => h.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={player.id}
              className="flex items-center gap-4 border-2 border-ink/15 bg-white p-4"
            >
              {/* Profile Picture */}
              {player.profile_pic_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={player.profile_pic_url}
                  alt={player.full_name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 object-cover border-2 border-ink/20"
                />
              ) : (
                <div className="h-14 w-14 shrink-0 bg-ink/10 border-2 border-ink/20 flex items-center justify-center">
                  <span className="font-mono text-xs text-ink/50">
                    {player.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <span className="font-display text-3xl text-clay">
                {player.jersey_number || "—"}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-display text-xl tracking-wide">
                  {player.full_name}
                </p>

                {/* Honors Badges */}
                {honors.length > 0 && (
                  <div className="mt-1 mb-1 flex flex-wrap gap-1.5">
                    {honors.map((honor, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-clay/20 text-clay px-2 py-0.5 rounded-full font-mono text-xs font-medium uppercase tracking-wide"
                      >
                        {honor}
                      </span>
                    ))}
                  </div>
                )}

                <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                  {player.position || ""}
                  {player.grad_year ? ` · Class of ${player.grad_year}` : ""}
                  {player.bats_throws ? ` · ${player.bats_throws}` : ""}
                </p>
              </div>
            </div>
          );
        })}

        {(!players || players.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            Roster coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
