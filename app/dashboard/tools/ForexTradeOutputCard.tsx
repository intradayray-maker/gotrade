"use client";

import { useEffect, useRef, useState } from "react";
import GTCard from "@/components/ui/GTCard";

type Trade = {
  ticker: string;
  side: string;
  entry: number;
  tp: number;
  stop: number;
};

type Derived = {
  units: number;
  position_value: number;
  required_margin: number;
};

export default function ForexTradeOutputCard() {
  const [trade, setTrade] = useState<Trade>({
    ticker: "",
    side: "",
    entry: 0,
    tp: 0,
    stop: 0,
  });

  const [derived, setDerived] = useState<Derived>({
    units: 0,
    position_value: 0,
    required_margin: 0,
  });

  const [riskPerTrade, setRiskPerTrade] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);

  const [animTrade, setAnimTrade] = useState(trade);
  const [animDerived, setAnimDerived] = useState(derived);

  const prevTrade = useRef(trade);
  const prevDerived = useRef(derived);

  const [flash, setFlash] = useState("");

  function fmtInt(n: number) {
    return Math.round(n).toLocaleString("en-US");
  }

  function fmtPrice(n: number, decimals = 5) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function copy(val: number) {
    navigator.clipboard.writeText(String(val));
  }

  const CopyBtn = ({ val }: { val: number }) => (
    <button
      onClick={() => copy(val)}
      className="ml-2 rounded-md bg-slate-700/40 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600/40 hover:text-white transition"
    >
      Copy
    </button>
  );

  // Load settings
  useEffect(() => {
    try {
      const storedRisk = localStorage.getItem("forex_dollar_risk");
      const storedLev = localStorage.getItem("forex_leverage");

      if (storedRisk) setRiskPerTrade(parseFloat(storedRisk));
      if (storedLev) setLeverage(parseFloat(storedLev));
    } catch {}
  }, []);

  // Poll trade
  useEffect(() => {
    let active = true;

    const pollTrade = async () => {
      try {
        const res = await fetch("/api/trade", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();
        if (!active || !json.trade) return;

        const t = json.trade as Trade;

        if (
          typeof t.ticker !== "string" ||
          typeof t.side !== "string" ||
          typeof t.entry !== "number" ||
          typeof t.stop !== "number" ||
          typeof t.tp !== "number"
        ) {
          return;
        }

        setTrade(t);
      } catch (err) {
        console.error("Error polling /api/trade:", err);
      }
    };

    pollTrade();
    const interval = setInterval(pollTrade, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // OANDA math
  useEffect(() => {
    if (!trade.entry || !trade.stop) {
      setDerived({
        units: 0,
        position_value: 0,
        required_margin: 0,
      });
      return;
    }

    const risk_distance = Math.abs(trade.entry - trade.stop);

    // pip value per unit
    const pipValuePerUnit = trade.ticker.endsWith("JPY") ? 0.01 : 0.0001;

    // OANDA units formula
    const units =
      risk_distance > 0 && riskPerTrade > 0
        ? riskPerTrade / (pipValuePerUnit * risk_distance) / 20
        : 0;

    const position_value = units * trade.entry;

    // OANDA margin formula
    const required_margin =
      leverage > 0 ? (position_value / leverage) * 10 : 0;

    setDerived({
      units,
      position_value,
      required_margin,
    });
  }, [trade, riskPerTrade, leverage]);

  // Animate transitions
  useEffect(() => {
    const oldT = prevTrade.current;
    const newT = trade;
    const oldD = prevDerived.current;
    const newD = derived;

    if (
      JSON.stringify(oldT) !== JSON.stringify(newT) ||
      JSON.stringify(oldD) !== JSON.stringify(newD)
    ) {
      setFlash(newT.side === "long" ? "flash-green" : newT.side === "short" ? "flash-red" : "");
      setTimeout(() => setFlash(""), 300);

      const duration = 300;
      const start = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = progress * (2 - progress);

        setAnimTrade({
          ticker: newT.ticker,
          side: newT.side,
          entry: oldT.entry + (newT.entry - oldT.entry) * eased,
          tp: oldT.tp + (newT.tp - oldT.tp) * eased,
          stop: oldT.stop + (newT.stop - oldT.stop) * eased,
        });

        setAnimDerived({
          units: oldD.units + (newD.units - oldD.units) * eased,
          position_value:
            oldD.position_value +
            (newD.position_value - oldD.position_value) * eased,
          required_margin:
            oldD.required_margin +
            (newD.required_margin - oldD.required_margin) * eased,
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      prevTrade.current = newT;
      prevDerived.current = newD;
    }
  }, [trade, derived]);

  const getSideColor = () => {
    if (animTrade.side === "long")
      return "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.45)]";
    if (animTrade.side === "short")
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
        <div
          className={`
            flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all
            ${flash === "flash-green" ? "bg-emerald-950/30" : ""}
            ${flash === "flash-red" ? "bg-red-950/30" : ""}
          `}
        >
          <span className="text-slate-400">Side:</span>
          <span className={`text-xl font-semibold capitalize tabular-nums ${getSideColor()}`}>
            {animTrade.side || "--"}
          </span>
        </div>

        {/* TICKER */}
        <div className="flex items-center justify-between rounded-xl border border-blue-500/20 p-3">
          <span className="text-slate-400">Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-blue-300 drop-shadow-[0_0_6px_rgba(0,150,255,0.45)]">
            {animTrade.ticker || "--"}
          </span>
        </div>

        {/* UNITS */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Units (OANDA):</span>
          <span className="text-xl font-semibold tabular-nums text-slate-200 flex items-center">
            {animDerived.units ? fmtInt(animDerived.units) : "--"}
            {animDerived.units > 0 && <CopyBtn val={Math.round(animDerived.units)} />}
          </span>
        </div>

        {/* POSITION VALUE */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Position Value (USD):</span>
          <span className="text-xl font-semibold tabular-nums text-slate-200 flex items-center">
            {animDerived.position_value ? `$${fmtInt(animDerived.position_value)}` : "--"}
            {animDerived.position_value > 0 && (
              <CopyBtn val={Math.round(animDerived.position_value)} />
            )}
          </span>
        </div>

        {/* REQUIRED MARGIN */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Required Margin:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-200 flex items-center">
            {animDerived.required_margin ? `$${fmtInt(animDerived.required_margin)}` : "--"}
            {animDerived.required_margin > 0 && (
              <CopyBtn val={Math.round(animDerived.required_margin)} />
            )}
          </span>
        </div>

        {/* ENTRY */}
        <div className="flex items-center justify-between rounded-xl border border-blue-500/20 p-3">
          <span className="text-slate-400">Entry Price:</span>
          <span className="text-xl font-semibold tabular-nums text-blue-300 flex items-center">
            {animTrade.entry ? fmtPrice(animTrade.entry) : "--"}
            {animTrade.entry > 0 && <CopyBtn val={animTrade.entry} />}
          </span>
        </div>

        {/* TP */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Take Profit:</span>
          <span className="text-xl font-semibold tabular-nums text-emerald-400 flex items-center">
            {animTrade.tp ? fmtPrice(animTrade.tp) : "--"}
            {animTrade.tp > 0 && <CopyBtn val={animTrade.tp} />}
          </span>
        </div>

        {/* STOP */}
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 p-3">
          <span className="text-slate-400">Stop Loss:</span>
          <span className="text-xl font-semibold tabular-nums text-red-400 flex items-center">
            {animTrade.stop ? fmtPrice(animTrade.stop) : "--"}
            {animTrade.stop > 0 && <CopyBtn val={animTrade.stop} />}
          </span>
        </div>

      </div>
    </GTCard>
  );
}
