import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function TeamSchedulePage() {
  const supabase = createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("game_date", { ascending: true });

  const record = (games || []).reduce(
    (acc, g) => {
      if (g.result === "W") acc.w += 1;
      if (g.result === "L") acc.l += 1;
      if (g.result === "T") acc.t += 1;
      return acc;
    },
    { w: 0, l: 0, t: 0 }
  );

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-4xl tracking-wide">Schedule</h1>
        <p className="font-mono text-sm text-ink/60">
          {record.w}-{record.l}
          {record.t ? `-${record.t}` : ""}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-2 border-ink/15 bg-white font-mono text-sm">
          <thead>
            <tr className="border-b-2 border-ink/15 bg-ink/5 text-left uppercase text-xs tracking-wide">
              <th className="p-3">Date</th>
              <th className="p-3">Opponent</th>
              <th className="p-3">Location</th>
              <th className="p-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {(games || []).map((g) => (
              <tr key={g.id} className="border-b border-ink/10">
                <td className="p-3 whitespace-nowrap">
                  {formatDate(g.game_date)}
                  {g.game_time ? ` · ${g.game_time}` : ""}
                </td>
                <td className="p-3">
                  {g.is_home ? "vs" : "@"} {g.opponent}
                </td>
                <td className="p-3">{g.location || "—"}</td>
                <td className="p-3">
                  {g.result
                    ? `${g.result} ${g.team_score ?? ""}${
                        g.team_score != null ? "-" : ""
                      }${g.opponent_score ?? ""}`
                    : "—"}
                </td>
              </tr>
            ))}
            {(!games || games.length === 0) && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-ink/50">
                  No games scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
