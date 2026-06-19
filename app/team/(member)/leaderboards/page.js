import { createClient } from "@/lib/supabase/server";
import { CURRENT_SEASON } from "@/lib/season";
import {
  battingAverage,
  onBasePercentage,
  sluggingPercentage,
  onBasePlusSlugging,
  era,
  whip,
  formatRate,
  formatEraWhip,
} from "@/lib/baseball-stats";

export const revalidate = 0;

function LeaderboardTable({ title, rows, valueLabel, formatValue }) {
  if (!rows.length) return null;
  return (
    <div>
      <h3 className="font-display text-xl tracking-wide">{title}</h3>
      <table className="mt-3 w-full border-2 border-ink/15 bg-white font-mono text-sm">
        <thead>
          <tr className="border-b-2 border-ink/15 bg-ink/5 text-left uppercase text-xs tracking-wide">
            <th className="p-2 w-10">#</th>
            <th className="p-2">Player</th>
            <th className="p-2 text-right">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.player.id} className="border-b border-ink/10">
              <td className="p-2 text-clay">{i + 1}</td>
              <td className="p-2">{row.player.full_name}</td>
              <td className="p-2 text-right">{formatValue(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function topRows(entries, valueFn, { ascending = false, minQualifier } = {}) {
  let list = entries
    .filter((e) => !minQualifier || minQualifier(e))
    .map((e) => ({ player: e.player, value: valueFn(e) }));
  list.sort((a, b) => (ascending ? a.value - b.value : b.value - a.value));
  return list.slice(0, 5);
}

export default async function LeaderboardsPage() {
  const supabase = createClient();

  const [{ data: players }, { data: battingRows }, { data: pitchingRows }] =
    await Promise.all([
      supabase.from("players").select("*"),
      supabase
        .from("batting_stats")
        .select("*")
        .eq("season", CURRENT_SEASON),
      supabase
        .from("pitching_stats")
        .select("*")
        .eq("season", CURRENT_SEASON),
    ]);

  const playerById = Object.fromEntries(
    (players || []).map((p) => [p.id, p])
  );

  const batting = (battingRows || [])
    .filter((b) => playerById[b.player_id])
    .map((b) => ({ ...b, player: playerById[b.player_id] }));

  const pitching = (pitchingRows || [])
    .filter((p) => playerById[p.player_id])
    .map((p) => ({ ...p, player: playerById[p.player_id] }));

  const hasBatting = batting.some((b) => b.at_bats > 0);
  const hasPitching = pitching.some((p) => p.innings_pitched > 0);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Leaderboards — {CURRENT_SEASON}
      </h1>

      <div className="mt-10">
        <h2 className="font-display text-2xl tracking-wide text-clay">
          Batting
        </h2>
        {hasBatting ? (
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            <LeaderboardTable
              title="Batting Average"
              rows={topRows(batting, battingAverage, {
                minQualifier: (b) => b.at_bats > 0,
              })}
              valueLabel="AVG"
              formatValue={(v) => formatRate(v)}
            />
            <LeaderboardTable
              title="On-Base Plus Slugging"
              rows={topRows(batting, onBasePlusSlugging, {
                minQualifier: (b) => b.at_bats > 0,
              })}
              valueLabel="OPS"
              formatValue={(v) => formatRate(v)}
            />
            <LeaderboardTable
              title="On-Base Percentage"
              rows={topRows(batting, onBasePercentage, {
                minQualifier: (b) => b.at_bats > 0,
              })}
              valueLabel="OBP"
              formatValue={(v) => formatRate(v)}
            />
            <LeaderboardTable
              title="Slugging Percentage"
              rows={topRows(batting, sluggingPercentage, {
                minQualifier: (b) => b.at_bats > 0,
              })}
              valueLabel="SLG"
              formatValue={(v) => formatRate(v)}
            />
            <LeaderboardTable
              title="Home Runs"
              rows={topRows(batting, (b) => b.home_runs)}
              valueLabel="HR"
              formatValue={(v) => v}
            />
            <LeaderboardTable
              title="RBI"
              rows={topRows(batting, (b) => b.rbi)}
              valueLabel="RBI"
              formatValue={(v) => v}
            />
            <LeaderboardTable
              title="Hits"
              rows={topRows(batting, (b) => b.hits)}
              valueLabel="H"
              formatValue={(v) => v}
            />
            <LeaderboardTable
              title="Stolen Bases"
              rows={topRows(batting, (b) => b.stolen_bases)}
              valueLabel="SB"
              formatValue={(v) => v}
            />
          </div>
        ) : (
          <p className="mt-4 font-mono text-sm text-ink/60">
            No batting stats entered yet this season.
          </p>
        )}
      </div>

      <div className="stitch-divider my-12" />

      <div>
        <h2 className="font-display text-2xl tracking-wide text-turf">
          Pitching
        </h2>
        {hasPitching ? (
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            <LeaderboardTable
              title="ERA"
              rows={topRows(pitching, era, {
                ascending: true,
                minQualifier: (p) => p.innings_pitched > 0,
              })}
              valueLabel="ERA"
              formatValue={(v) => formatEraWhip(v)}
            />
            <LeaderboardTable
              title="WHIP"
              rows={topRows(pitching, whip, {
                ascending: true,
                minQualifier: (p) => p.innings_pitched > 0,
              })}
              valueLabel="WHIP"
              formatValue={(v) => formatEraWhip(v)}
            />
            <LeaderboardTable
              title="Wins"
              rows={topRows(pitching, (p) => p.wins)}
              valueLabel="W"
              formatValue={(v) => v}
            />
            <LeaderboardTable
              title="Strikeouts"
              rows={topRows(pitching, (p) => p.strikeouts)}
              valueLabel="K"
              formatValue={(v) => v}
            />
            <LeaderboardTable
              title="Saves"
              rows={topRows(pitching, (p) => p.saves)}
              valueLabel="SV"
              formatValue={(v) => v}
            />
          </div>
        ) : (
          <p className="mt-4 font-mono text-sm text-ink/60">
            No pitching stats entered yet this season.
          </p>
        )}
      </div>
    </div>
  );
}
