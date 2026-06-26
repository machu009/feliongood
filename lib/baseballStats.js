// Batting average
export function formatAvg(hits, atBats) {
  if (!atBats || atBats === 0) return "—";
  return (hits / atBats).toFixed(3).replace(/^0/, "");
}

// On-base percentage: (H + BB + HBP) / (AB + BB + HBP)
export function formatObp(hits, walks, hitByPitch, atBats) {
  const denom = (atBats || 0) + (walks || 0) + (hitByPitch || 0);
  if (denom === 0) return "—";
  const obp = ((hits || 0) + (walks || 0) + (hitByPitch || 0)) / denom;
  return obp.toFixed(3).replace(/^0/, "");
}

// Slugging percentage: (1B + 2*2B + 3*3B + 4*HR) / AB
export function formatSlg(hits, doubles, triples, homeRuns, atBats) {
  if (!atBats || atBats === 0) return "—";
  const singles = (hits || 0) - (doubles || 0) - (triples || 0) - (homeRuns || 0);
  const totalBases =
    singles + 2 * (doubles || 0) + 3 * (triples || 0) + 4 * (homeRuns || 0);
  return (totalBases / atBats).toFixed(3).replace(/^0/, "");
}

// ERA: earned runs * 9 / innings pitched
export function formatEra(earnedRuns, inningsPitched) {
  if (!inningsPitched || inningsPitched === 0) return "—";
  const era = ((earnedRuns || 0) * 9) / inningsPitched;
  return era.toFixed(2);
}

// WHIP: (walks + hits allowed) / innings pitched
export function formatWhip(walksAllowed, hitsAllowed, inningsPitched) {
  if (!inningsPitched || inningsPitched === 0) return "—";
  const whip = ((walksAllowed || 0) + (hitsAllowed || 0)) / inningsPitched;
  return whip.toFixed(2);
}
