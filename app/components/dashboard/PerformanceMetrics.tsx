"use client";

import { useEffect, useState } from "react";

type RealizedTrade = {
  pnl: number;
  pnlPct: number;
  created_at: string;
};

export default function PerformanceMetrics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/trades/list?limit=500");
      const json = await res.json();
      const trades = json.data ?? [];

      if (!trades || trades.length === 0) {
        setStats({
          totalPnl: 0,
          totalPnlPct: 0,
          maxDrawdown: 0,
          winRate: 0,
          wins: 0,
          losses: 0,
          totalTrades: 0,
          profitFactor: 0,
          riskAdjusted: 0,
        });
        setLoading(false);
        return;
      }

      // -----------------------------
      // REALIZED PNL CALCULATION
      // -----------------------------
      const positions: Record<string, { qty: number; avg: number }> = {};
      const realized: RealizedTrade[] = [];

      for (const t of trades) {
        const sym = t.symbol;
        const side = t.side.toLowerCase();
        const price = t.price;

        if (!positions[sym]) {
          positions[sym] = { qty: 0, avg: 0 };
        }

        const pos = positions[sym];

        if (side === "buy") {
          const newQty = pos.qty + t.qty;
          pos.avg = (pos.avg * pos.qty + price * t.qty) / newQty;
          pos.qty = newQty;
        }

        if (side === "sell") {
          if (pos.qty > 0) {
            const pnl = (price - pos.avg) * Math.min(pos.qty, t.qty);
            const pnlPct = ((price - pos.avg) / pos.avg) * 100;

            realized.push({
              pnl,
              pnlPct,
              created_at: t.created_at,
            });

            pos.qty -= t.qty;
            if (pos.qty < 0) pos.qty = 0;
          }
        }
      }

      if (realized.length === 0) {
        setStats({
          totalPnl: 0,
          totalPnlPct: 0,
          maxDrawdown: 0,
          winRate: 0,
          wins: 0,
          losses: 0,
          totalTrades: 0,
          profitFactor: 0,
          riskAdjusted: 0,
        });
        setLoading(false);
        return;
      }

      // -----------------------------
      // METRICS
      // -----------------------------
      const pnls = realized.map((r) => r.pnl);
      const wins = pnls.filter((p) => p > 0);
      const losses = pnls.filter((p) => p < 0);

      const totalPnl = pnls.reduce((a, b) => a + b, 0);
      const totalPnlPct =
        realized.reduce((a, b) => a + b.pnlPct, 0) / realized.length;

      // Max drawdown
      let peak = 0;
      let dd = 0;
      let running = 0;
      for (const p of pnls) {
        running += p;
        peak = Math.max(peak, running);
        dd = Math.min(dd, running - peak);
      }
      const maxDrawdown = dd;

      const winRate = wins.length / realized.length;

      const grossProfit = wins.reduce((a, b) => a + b, 0);
      const grossLoss = Math.abs(losses.reduce((a, b) => a + b, 0));
      const profitFactor = grossLoss === 0 ? 0 : grossProfit / grossLoss;

      const mean = totalPnl / realized.length;
      const variance =
        pnls.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
        realized.length;
      const std = Math.sqrt(variance);
      const riskAdjusted = std === 0 ? 0 : mean / std;

      setStats({
        totalPnl,
        totalPnlPct,
        maxDrawdown,
        winRate,
        wins: wins.length,
        losses: losses.length,
        totalTrades: realized.length,
        profitFactor,
        riskAdjusted,
      });

      setLoading(false);
    };

    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-neutral-400 text-sm">
        Loading performance metrics…
      </div>
    );
  }

  // Helper for formatting currency
  const formatCurrency = (v: number) =>
    v.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  return (
    <div className=" p-2">
      <div className="mb-1 flex items-center justify-between">
      </div>

      <div className="space-y-4">

        {/* Total P&L */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Total P&L</div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${stats.totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {formatCurrency(stats.totalPnl)}
            </div>
            <div className={`text-xs ${stats.totalPnlPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stats.totalPnlPct.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* Max Drawdown */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Max Drawdown</div>
          <div className={`text-lg font-semibold ${stats.maxDrawdown >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(stats.maxDrawdown)}
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* Win Rate */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Win Rate</div>
          <div className="text-right">
            <div className="text-lg font-semibold text-slate-200">
              {(stats.winRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">
              {stats.wins} / {stats.totalTrades} trades
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* Profit Factor */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Profit Factor</div>
          <div className="text-lg font-semibold text-slate-200">
            {stats.profitFactor.toFixed(2)}
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* Risk Adjusted */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Risk‑adjusted</div>
          <div className="text-lg font-semibold text-slate-200">
            {stats.riskAdjusted.toFixed(2)}
          </div>
        </div>

      </div>
    </div>
  );
}
