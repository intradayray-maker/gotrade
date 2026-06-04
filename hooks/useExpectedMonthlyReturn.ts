"use client";

import { useEffect, useState } from "react";

type Trade = {
  created_at: string;
  pnlPct: number; // % return for that trade (e.g. 2.5 for +2.5%)
};

export function useExpectedMonthlyReturn() {
  const [loading, setLoading] = useState(true);
  const [expectedMonthlyReturnPct, setExpectedMonthlyReturnPct] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/trades/list?limit=500");
        const json = await res.json();
        const trades: Trade[] = json.data ?? [];

        if (!trades || trades.length === 0) {
          setExpectedMonthlyReturnPct(0);
          setLoading(false);
          return;
        }

        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
        const cutoff = Date.now() - THIRTY_DAYS;

        const last30 = trades.filter(
          (t) => new Date(t.created_at).getTime() >= cutoff
        );

        if (last30.length === 0) {
          setExpectedMonthlyReturnPct(0);
          setLoading(false);
          return;
        }

        // Avg ROI per trade (in %)
        const avgRoiPerTrade =
          last30.reduce((sum, t) => sum + t.pnlPct, 0) / last30.length;

        // Trades per month (approx: 21 trading days)
        const tradesPerDay = last30.length / 30;
        const tradesPerMonth = tradesPerDay * 21;

        const monthlyReturnPct = avgRoiPerTrade * tradesPerMonth;

        setExpectedMonthlyReturnPct(monthlyReturnPct);
      } catch (e) {
        console.error("useExpectedMonthlyReturn error:", e);
        setExpectedMonthlyReturnPct(0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { expectedMonthlyReturnPct, loading };
}
