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

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes}${ampm}`;
}

export default async function TeamSchedulePage() {
  const supabase = createClient();

  // Fetch games with program info
  const { data: games } = await supabase
    .from("games")
    .select("*, programs(id, name)")
    .order("game_date", { ascending: true });

  // Fetch practices with program info
  const { data: practices } = await supabase
    .from("practices")
    .select("*, programs(id, name)")
    .eq("is_cancelled", false)
    .order("practice_date", { ascending: true });

  // Calculate win-loss record
  const record = (games || []).reduce(
    (acc, g) => {
      if (g.result === "W") acc.w += 1;
      if (g.result === "L") acc.l += 1;
      if (g.result === "T") acc.t += 1;
      return acc;
    },
    { w: 0, l: 0, t: 0 }
  );

  // Combine and sort by date
  const allEvents = [
    ...(games || []).map((g) => ({ ...g, type: "game", date: g.game_date })),
    ...(practices || []).map((p) => ({ ...p, type: "practice", date: p.practice_date })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

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
              <th className="p-3">Type</th>
              <th className="p-3">Opponent / Details</th>
              <th className="p-3">Location</th>
              <th className="p-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((event) => (
              <tr
                key={`${event.type}-${event.id}`}
                className={`border-b border-ink/10 ${
                  event.type === "practice" ? "bg-turf/5" : ""
                }`}
              >
                <td className="p-3 whitespace-nowrap">
                  {formatDate(event.date)}
                  {event.time ? ` · ${formatTime(event.time)}` : ""}
                </td>
                <td className="p-3 uppercase text-xs tracking-wide font-bold">
                  {event.type === "game" ? "Game" : <span className="text-turf">Practice</span>}
                </td>
                <td className="p-3">
                  <div>
                    {event.type === "game"
                      ? `${event.is_home ? "vs" : "@"} ${event.opponent}`
                      : event.special_gear
                      ? `📦 ${event.special_gear}`
                      : "—"}
                  </div>
                  {event.programs?.name && (
                    <div className="font-mono text-xs text-ink/60 mt-1">
                      {event.programs.name}
                    </div>
                  )}
                </td>
                <td className="p-3">{event.location || "—"}</td>
                <td className="p-3">
                  {event.type === "game"
                    ? event.result
                      ? `${event.result} ${event.team_score ?? ""}${
                          event.team_score != null ? "-" : ""
                        }${event.opponent_score ?? ""}`
                      : "—"
                    : "—"}
                </td>
              </tr>
            ))}
            {allEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink/50">
                  No games or practices scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
