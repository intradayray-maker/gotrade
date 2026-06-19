// lib/safety-score.ts

export function computeSafetyScore(data: any) {
  if (!data || !data.fundamentals || !data.dividends) return 0;

  const f = data.fundamentals;
  const d = data.dividends?.[0] || {};

  let score = 0;

  // Example scoring logic — adjust as needed
  if (f.peRatio) score += Math.max(0, 20 - f.peRatio);
  if (f.marketCap) score += Math.min(f.marketCap / 1e11, 20);
  if (d.dividendYield) score += Math.min(d.dividendYield * 2, 20);
  if (d.payoutRatio) score += Math.max(0, 20 - d.payoutRatio / 5);

  return Math.round(Math.min(score, 100));
}
