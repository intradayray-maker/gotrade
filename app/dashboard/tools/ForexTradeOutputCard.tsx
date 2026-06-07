// app/dashboard/tools/ForexTradeOutputCard.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import GTCard from "@/components/ui/GTCard";

// ⭐ Inject AI Pulse Animations
const pulseStyles = `
@keyframes pulse-blue {
  0% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
  50% { box-shadow: 0 0 18px rgba(0,150,255,0.55); }
  100% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
  50% { box-shadow: 0 0 18px rgba(255,0,0,0.55); }
  100% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
}

.ai-pulse-blue {
  animation: pulse-blue 3.2s ease-in-out infinite;
  border-color: rgba(0,150,255,0.45) !important;
}

.ai-pulse-red {
  animation: pulse-red 3.2s ease-in-out infinite;
  border-color: rgba(255,0,0,0.45) !important;
}
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = pulseStyles;
  document.head.appendChild(styleTag);
}

type Trade = {
  ticker: string;
  side: string;
  entry: number;
  tp: number;
  stop: number;
  timestamp?: string;
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
    timestamp: "",
  });

  const [derived, setDerived] = useState<Derived>({
    units: 0,
    position_value: 0,
    required_margin: 0,
  });

  const [leverage, setLeverage] = useState<number>(1);
  const [marginFromAi, setMarginFromAi] = useState<number>(0);

  const [animTrade, setAnimTrade] = useState(trade);
  const [animDerived, setAnimDerived] = useState(derived);

  const prevTrade = useRef(trade);
  const prevDerived = useRef(derived);

  const [flash, setFlash] = useState("");

  // ⭐ NEW — Prevent phantom side flips + repeated trade dedupe
  const lastTimestampRef = useRef<string | null>(null);
  const lastTradeRef = useRef<Trade | null>(null);

  const isSameTrade = (a: Trade | null, b: Trade) => {
    return (
      a !== null &&
      a.ticker === b.ticker &&
      a.side === b.side &&
      a.entry === b.entry &&
      a.stop === b.stop &&
      a.tp === b.tp
    );
  };

  function fmtInt(n: number) {
    return Math.round(n).toLocaleString("en-US");
  }

  function fmtPrice(n: number, decimals = 5) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const CopyBtn = ({ val }: { val: number }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(String(val));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    };

    return (
      <button
        onClick={handleCopy}
        className={`
          relative ml-2 rounded-md px-2 py-1 text-xs font-medium transition-all
          ${copied
            ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(0,255,0,0.45)] scale-105"
            : "text-slate-300 bg-slate-700/40 hover:bg-slate-600/40 hover:text-white"
          }
        `}
      >
        {copied ? "✓ Copied!" : "Copy"}

        {copied && (
          <span className="absolute inset-0 rounded-md bg-emerald-400/20 animate-ping"></span>
        )}
      </button>
    );
  };

  // Load leverage + margin from AI card
  useEffect(() => {
    try {
      const storedLev = localStorage.getItem("forex_leverage");
      const storedMargin = localStorage.getItem("forex_required_margin");

      if (storedLev) setLeverage(parseFloat(storedLev));
      if (storedMargin) setMarginFromAi(parseFloat(storedMargin));
    } catch {}
  }, []);

  // Sync margin from AI card every second
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const storedMargin = localStorage.getItem("forex_required_margin");
        if (storedMargin) {
          const m = parseFloat(storedMargin);
          setMarginFromAi((prev) => (prev !== m ? m : prev));
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⭐ POLL TRADE — now with timestamp guard
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
          typeof t.ticker === "string" &&
          typeof t.side === "string" &&
          typeof t.entry === "number" &&
          typeof t.stop === "number" &&
          typeof t.tp === "number"
        ) {
          if (isSameTrade(lastTradeRef.current, t)) {
            return;
          }

          if (t.timestamp) {
            lastTimestampRef.current = t.timestamp;
          }

          lastTradeRef.current = t;
          setTrade(t);
        }
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

  // Compute derived values
  const computeDerived = () => {
    if (!trade.entry || marginFromAi <= 0 || leverage <= 0) {
      return {
        units: 0,
        position_value: 0,
        required_margin: marginFromAi,
      };
    }

    const units = (marginFromAi * leverage) / trade.entry;
    const positionValue = units * trade.entry;

    return {
      units,
      position_value: positionValue,
      required_margin: marginFromAi,
    };
  };

  useEffect(() => {
    setDerived(computeDerived());
  }, [trade, marginFromAi, leverage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDerived(computeDerived());
    }, 60000);

    return () => clearInterval(interval);
  }, [trade, marginFromAi, leverage]);

  // Animate transitions
  useEffect(() => {
    const oldT = prevTrade.current;
    const newT = trade;
    const oldD = prevDerived.current;
    const newD = derived;

    // ⭐ Only animate on REAL trade changes
    if (newT.timestamp !== oldT.timestamp) {
      setFlash(
        newT.side === "long"
          ? "flash-green"
          : newT.side === "short"
          ? "flash-red"
          : ""
      );
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
          timestamp: newT.timestamp,
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

  // ⭐ FINAL RENDER WITH AI PULSE GLOW
  return (
    <GTCard
      className={`
        flex h-full flex-col gap-4 border-2 rounded-xl transition-all
        ${animTrade.side === "long" ? "ai-pulse-blue" : ""}
        ${animTrade.side === "short" ? "ai-pulse-red" : ""}
      `}
    >
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
          <span className="text-slate-400">Units:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-200 flex items-center">
            {animDerived.units ? fmtInt(animDerived.units) : "--"}
            {animDerived.units > 0 && <CopyBtn val={Math.round(animDerived.units)} />}
          </span>
        </div>

        {/* POSITION VALUE */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Trade Amount:</span>
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
