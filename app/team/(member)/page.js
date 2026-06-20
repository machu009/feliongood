import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function TeamHomePage() {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  let profile = null;
  if (userData?.user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();
    profile = p;
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: nextGame } = await supabase
    .from("games")
    .select("*")
    .gte("game_date", today)
    .order("game_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">
        {profile?.full_name || "Team"}
      </h1>

      {nextGame ? (
        <div className="mt-8 border-2 border-ink bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
            Next Game
          </p>
          <p className="mt-1 font-display text-2xl tracking-wide">
            {nextGame.is_home ? "vs" : "@"} {nextGame.opponent}
          </p>
          <p className="font-mono text-sm text-ink/70">
            {formatDate(nextGame.game_date)}
            {nextGame.game_time ? ` · ${nextGame.game_time}` : ""}
            {nextGame.location ? ` · ${nextGame.location}` : ""}
          </p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <QuickLink href="/team/locker-room" label="Locker Room" />
        <QuickLink href="/team/calendar" label="Team Calendar" />
        <QuickLink href="/team/schedule" label="Full Schedule" />
        <QuickLink href="/team/roster" label="Roster" />
        <QuickLink href="/team/leaderboards" label="Leaderboards" />
        <QuickLink href="/team/rules" label="Team Rule Book" />
        <QuickLink href="/team/contact" label="Contact Coach" />
      </div>
    </div>
  );
}

function QuickLink({ href, label }) {
  return (
    <Link
      href={href}
      className="border-2 border-ink/15 bg-white p-5 font-display text-xl tracking-wide hover:border-clay"
    >
      {label} →
    </Link>
  );
}
