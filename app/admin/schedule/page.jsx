import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteGameButton from "@/components/DeleteGameButton";
import PracticeAttendanceModal from "@/components/PracticeAttendanceModal";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getWeekKey(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const year = date.getFullYear();
  const weekNumber = Math.floor((date.getDate() + 6) / 7);
  return `${year}-W${weekNumber}`;
}

function getWeekLabel(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  return `Week of ${monthName} ${date.getDate()}`;
}

export default async function SchedulePage() {
  const supabase = createClient();

  // Fetch games
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("game_date", { ascending: true });

  // Fetch practices
  const { data: practices } = await supabase
    .from("practices")
    .select("*")
    .eq("is_cancelled", false)
    .order("practice_date", { ascending: true });

  // Combine and group by week
  const allEvents = [
    ...(games || []).map((g) => ({ ...g, type: "game", date: g.game_date })),
    ...(practices || []).map((p) => ({ ...p, type: "practice", date: p.practice_date })),
  ];

  const grouped = allEvents.reduce((acc, event) => {
    const week = getWeekKey(event.date);
    if (!acc[week]) acc[week] = [];
    acc[week].push(event);
    return acc;
  }, {});

  // Sort weeks chronologically
  const sortedWeeks = Object.keys(grouped).sort();

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Schedule</h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            {games?.length || 0} games · {practices?.length || 0} practices
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/schedule/new"
            className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-ink/90"
          >
            + Add Game
          </Link>
          <Link
            href="/admin/schedule/practices/new"
            className="bg-turf px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-white hover:bg-turf/90"
          >
            + Practice
          </Link>
        </div>
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="mt-8">
          <p className="font-mono text-sm text-ink/60">
            No upcoming games or practices.{" "}
            <Link href="/admin/schedule/new" className="text-clay underline">
              Add your first game
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {sortedWeeks.map((week) => (
            <div key={week}>
              <h2 className="font-mono text-xs uppercase tracking-wide text-ink/50 mb-3">
                {getWeekLabel(grouped[week][0].date)}
              </h2>

              <div className="space-y-2">
                {grouped[week]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event) =>
                    event.type === "game" ? (
                      <GameEvent key={event.id} game={event} />
                    ) : (
                      <PracticeEvent key={event.id} practice={event} />
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GameEvent({ game }) {
  return (
    <div className="flex items-center justify-between border-2 border-ink/15 bg-white p-4 hover:bg-ink/5">
      <div>
        <div className="flex items-center gap-3">
          <p className="font-display text-lg tracking-wide">
            {game.is_home ? "vs" : "@"} {game.opponent}
          </p>
          {game.result ? (
            <span
              className={`stamp font-mono text-xs uppercase ${
                game.result === "W" ? "text-turf" : "text-clay"
              }`}
            >
              {game.result} {game.team_score ?? ""}
              {game.team_score != null ? "-" : ""}
              {game.opponent_score ?? ""}
            </span>
          ) : null}
        </div>
        <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
          {formatDate(game.game_date)}
          {game.game_time ? ` · ${game.game_time}` : ""}
          {game.location ? ` · ${game.location}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Link
          href={`/admin/schedule/${game.id}/edit`}
          className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink"
        >
          Edit
        </Link>
        <DeleteGameButton gameId={game.id} opponent={game.opponent} />
      </div>
    </div>
  );
}

function PracticeEvent({ practice }) {
  return (
    <div className="flex items-center justify-between border-2 border-turf/30 bg-turf/5 p-4 hover:bg-turf/10">
      <div>
        <div className="flex items-center gap-3">
          <p className="font-display text-lg tracking-wide text-turf">
            Practice
          </p>
          {practice.location && (
            <span className="stamp font-mono text-xs uppercase text-turf">
              {practice.location}
            </span>
          )}
        </div>
        <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
          {formatDate(practice.practice_date)} · {practice.start_time}
          {practice.duration_minutes && ` · ${practice.duration_minutes} min`}
        </p>
        {practice.special_gear && (
          <p className="font-mono text-xs text-turf/70 mt-1">
            📦 {practice.special_gear}
          </p>
        )}
      </div>
      <div className="flex items-center gap-5">
        <Link
          href={`/admin/schedule/practices/${practice.id}/attendance`}
          className="font-mono text-xs uppercase tracking-wide text-turf hover:text-turf/70"
        >
          Attendance
        </Link>
        <Link
          href={`/admin/schedule/practices/${practice.id}/edit`}
          className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
