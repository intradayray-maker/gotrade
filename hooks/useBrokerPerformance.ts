import { useEffect, useState } from "react";

export function useBrokerPerformance() {
  const [expectedMonthlyReturnPct, setExpectedMonthlyReturnPct] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/trades/list");
        const json = await res.json();

        const trades = json?.trades ?? [];

        // Only closed trades with realized PnL
        const closed = trades.filter((t: any) => t.realizedPnl !== undefined);

        if (closed.length === 0) {
          setExpectedMonthlyReturnPct(0);
          setLoading(false);
          return;
        }

        // Last 30 days
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recent = closed.filter((t: any) => new Date(t.timestamp).getTime() >= cutoff);

        if (recent.length === 0) {
          setExpectedMonthlyReturnPct(0);
          setLoading(false);
          return;
        }

        // Total realized PnL
        const totalPnl = recent.reduce((sum: number, t: any) => sum + (t.realizedPnl ?? 0), 0);

        // Average equity (fallback to 1 to avoid divide-by-zero)
        const avgEquity =
          recent.reduce((sum: number, t: any) => sum + (t.equity ?? 0), 0) /
            recent.length || 1;

        // Monthly return %
        const monthlyReturnPct = (totalPnl / avgEquity) * 100;

        setExpectedMonthlyReturnPct(monthlyReturnPct);
      } catch (err) {
        console.error("ROI calc error:", err);
        setExpectedMonthlyReturnPct(0);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { expectedMonthlyReturnPct, loading };
}
