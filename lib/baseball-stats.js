// Shared helpers for turning raw counting stats into the rate stats
// shown on leaderboards. Innings pitched uses baseball notation:
// the digit after the decimal is OUTS (0, 1, or 2), not tenths.
// e.g. 12.1 means 12 and 1/3 innings (37 outs).

export function inningsToOuts(innings) {
  const whole = Math.trunc(innings);
  const partial = Math.round((innings - whole) * 10); // 0, 1, or 2
  return whole * 3 + partial;
}

export function outsToInnings(outs) {
  const whole = Math.trunc(outs / 3);
  const remainder = outs % 3;
  return Number(`${whole}.${remainder}`);
}

export function battingAverage(b) {
  if (!b.at_bats) return 0;
  return b.hits / b.at_bats;
}

export function onBasePercentage(b) {
  const denom = b.at_bats + b.walks + b.hit_by_pitch;
  if (!denom) return 0;
  return (b.hits + b.walks + b.hit_by_pitch) / denom;
}

export function sluggingPercentage(b) {
  if (!b.at_bats) return 0;
  const singles = b.hits - b.doubles - b.triples - b.home_runs;
  const totalBases =
    singles + b.doubles * 2 + b.triples * 3 + b.home_runs * 4;
  return totalBases / b.at_bats;
}

export function onBasePlusSlugging(b) {
  return onBasePercentage(b) + sluggingPercentage(b);
}

export function era(p) {
  const outs = inningsToOuts(p.innings_pitched);
  if (!outs) return 0;
  const innings = outs / 3;
  return (p.earned_runs * 9) / innings;
}

export function whip(p) {
  const outs = inningsToOuts(p.innings_pitched);
  if (!outs) return 0;
  const innings = outs / 3;
  return (p.walks_allowed + p.hits_allowed) / innings;
}

export function formatRate(n, decimals = 3) {
  if (!isFinite(n)) return "—";
  // Batting average style: .345 instead of 0.345
  return n.toFixed(decimals).replace(/^0\./, ".");
}

export function formatEraWhip(n) {
  if (!isFinite(n)) return "—";
  return n.toFixed(2);
}
