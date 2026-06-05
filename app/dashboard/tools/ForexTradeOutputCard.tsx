"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";

type Trade = {
  ticker: string;
  side: string;
  size: number;
  entry: number;
  tp: number;
  stop: number;
  required_margin: number;
  risk_distance: number;
};

export default function TradeOutput() {
  const [data, setData] = useState<Trade>({
    ticker: "",
    side: "",
    size: 0,
    entry: 0,
    tp: 0,
    stop: 0,
    required_margin: 0,
    risk_distance: 0,
  });

  useEffect(() => {
    let active = true;

    const pollTrade = async () => {
      const res = await fetch("/api/trade", { cache: "no-store" });
      const json = await res.json();

      if (
        active &&
        json &&
        typeof json === "object" &&
        typeof json.ticker === "string" &&
        typeof json.side === "string"
      ) {
        setData(json);
      }
    };

    pollTrade();
    const interval = setInterval(pollTrade, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const getSideColor = () => {
    if (data.side === "long")
      return "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.45)]";
    if (data.side === "short")
      return "text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]";
    return "text-slate-500";
  };

  return (
    <GTCard className="flex h-full flex-col gap-4">
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Trade Execution Details
      </p>

      <div className="space-y-3">

        {/* SIDE */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Side:</span>
          <span className={`text-xl font-semibold capitalize tabular-nums ${getSideColor()}`}>
            {data.side || "--"}
          </span>
        </div>

        {/* TICKER */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.ticker || "--"}
          </span>
        </div>

        {/* SIZE */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Size:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.size ? data.size.toFixed(2) : "--"}
          </span>
        </div>

        {/* REQUIRED MARGIN */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Required Margin:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.required_margin ? data.required_margin.toFixed(2) : "--"}
          </span>
        </div>

        {/* RISK DISTANCE */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Risk Distance:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.risk_distance ? data.risk_distance.toFixed(5) : "--"}
          </span>
        </div>

        {/* ENTRY */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Entry Price:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.entry || "--"}
          </span>
        </div>

        {/* TP */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Take Profit:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.tp || "--"}
          </span>
        </div>

        {/* STOP */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Stop Loss:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            {data.stop || "--"}
          </span>
        </div>

      </div>
    </GTCard>
  );
}
