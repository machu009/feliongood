import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CURRENT_SEASON } from "@/lib/season";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function StatTile({ label, value, href }) {
  const inner = (
    <div className="border-2 border-ink/15 bg-white p-4 text-center hover:border-clay">
      <p className="font-display text-3xl text-clay">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/60">
        {label}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Card({ title, viewAllHref, viewAllLabel = "View all →", children }) {
  return (
    <div className="border-2 border-ink/15 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="font-mono text-xs text-clay hover:underline"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: programs },
    { data: signups },
    { data: players },
    { data: games },
    { data: members },
    { data: messages },
    { data: teamSettings },
  ] = await Promise.all([
    supabase.from("programs").select("*").eq("is_active", true),
    supabase.from("signups").select("id"),
    supabase
      .from("players")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("full_name", { ascending: true }),
    supabase.from("games").select("*").order("game_date", { ascending: true }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("team_settings").select("*").single(),
  ]);

  const upcomingGames = (games || []).filter((g) => g.game_date >= today);
  const nextGame = upcomingGames[0];
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
      <h1 className="font-display text-4xl tracking-wide">Dashboard</h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Everything in one place — {CURRENT_SEASON} season
      </p>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <StatTile label="Programs" value={programs?.length || 0} href="/admin/programs" />
        <StatTile label="Sign-ups" value={signups?.length || 0} href="/admin/programs" />
        <StatTile label="Roster" value={players?.length || 0} href="/admin/roster" />
        <StatTile label="Upcoming" value={upcomingGames.length} href="/admin/schedule" />
        <StatTile label="Team Members" value={members?.length || 0} href="/admin/team" />
        <StatTile label="Messages" value={messages?.length || 0} href="/admin/messages" />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Calendar & Schedule */}
        <Card title="Calendar & Schedule" viewAllHref="/admin/schedule">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
            Record: {record.w}-{record.l}{record.t ? `-${record.t}` : ""}
          </p>
          {nextGame ? (
            <div className="mt-3 border-2 border-ink/10 bg-chalk p-3">
              <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                Next Game
              </p>
              <p className="font-display text-lg tracking-wide">
                {nextGame.is_home ? "vs" : "@"} {nextGame.opponent}
              </p>
              <p className="font-mono text-xs text-ink/60">
                {formatDate(nextGame.game_date)}
                {nextGame.game_time ? ` · ${nextGame.game_time}` : ""}
              </p>
            </div>
          ) : (
            <p className="mt-3 font-mono text-sm text-ink/50">
              No upcoming games scheduled.
            </p>
          )}
          <p className="mt-3 font-mono text-xs text-ink/50">
            Google Calendar:{" "}
            {teamSettings?.google_calendar_embed_url ? (
              <span className="text-turf">connected</span>
            ) : (
              <Link href="/admin/team-settings" className="text-clay underline">
                not connected — set it up
              </Link>
            )}
          </p>
        </Card>

        {/* Active Roster */}
        <Card title="Active Roster" viewAllHref="/admin/roster">
          {players && players.length > 0 ? (
            <ul className="space-y-1.5 font-mono text-sm">
              {players.slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="w-6 text-clay">{p.jersey_number || "—"}</span>
                  <span className="flex-1">{p.full_name}</span>
                  <span className="text-xs uppercase text-ink/50">
                    {p.position || ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm text-ink/50">
              No players on the roster yet.
            </p>
          )}
          {players && players.length > 8 ? (
            <p className="mt-2 font-mono text-xs text-ink/40">
              +{players.length - 8} more
            </p>
          ) : null}
        </Card>

        {/* Programs & Sign-ups */}
        <Card title="Programs & Sign-Ups" viewAllHref="/admin/programs">
          {programs && programs.length > 0 ? (
            <ul className="space-y-2 font-mono text-sm">
              {programs.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-xs uppercase text-ink/50">
                    {p.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm text-ink/50">
              No active programs.{" "}
              <Link href="/admin/programs/new" className="text-clay underline">
                Add one
              </Link>
              .
            </p>
          )}
        </Card>

        {/* Team Members */}
        <Card title="Team Members" viewAllHref="/admin/team">
          {members && members.length > 0 ? (
            <ul className="space-y-1.5 font-mono text-sm">
              {members.slice(0, 6).map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span>{m.full_name || m.email}</span>
                  {m.role === "admin" ? (
                    <span className="text-xs uppercase text-brass">Admin</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm text-ink/50">
              No team member accounts yet.{" "}
              <Link href="/admin/team/new" className="text-clay underline">
                Add one
              </Link>
              .
            </p>
          )}
        </Card>

        {/* Recent Messages */}
        <Card title="Recent Messages" viewAllHref="/admin/messages">
          {messages && messages.length > 0 ? (
            <ul className="space-y-3 font-mono text-sm">
              {messages.map((m) => (
                <li key={m.id}>
                  <p className="text-ink">{m.sender_name}</p>
                  <p className="truncate text-xs text-ink/60">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm text-ink/50">No messages yet.</p>
          )}
        </Card>

        {/* Team Settings status */}
        <Card title="Team Settings" viewAllHref="/admin/team-settings">
          <ul className="space-y-2 font-mono text-sm">
            <li className="flex items-center justify-between">
              <span>Google Calendar</span>
              <span
                className={
                  teamSettings?.google_calendar_embed_url
                    ? "text-turf"
                    : "text-ink/40"
                }
              >
                {teamSettings?.google_calendar_embed_url
                  ? "Connected"
                  : "Not set"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Rule Book</span>
              <span
                className={
                  teamSettings?.rulebook_path ? "text-turf" : "text-ink/40"
                }
              >
                {teamSettings?.rulebook_path ? "Uploaded" : "Not uploaded"}
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
