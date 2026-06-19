import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteGameButton from "@/components/DeleteGameButton";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function SchedulePage() {
  const supabase = createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("game_date", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Schedule</h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            {games?.length || 0} games
          </p>
        </div>
        <Link
          href="/admin/schedule/new"
          className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-ink/90"
        >
          + Add Game
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {(games || []).map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between border-2 border-ink/15 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl tracking-wide">
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
        ))}

        {(!games || games.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            No games yet.{" "}
            <Link href="/admin/schedule/new" className="text-clay underline">
              Add your first game
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
