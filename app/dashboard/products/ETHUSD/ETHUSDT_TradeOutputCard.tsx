// app\dashboard\products\ETHUSD\ETHUSDT_TradeOutputCard.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import GTCard from "@/components/ui/GTCard";

// Unified Supabase client
import { getBrowserSupabase } from "@/lib/supabase/browserClient";
const supabase = getBrowserSupabase();

// ------------------------------------------------------------
// AI PULSE STYLES
// ------------------------------------------------------------
const pulseStyles = `
@keyframes pulse-blue {
  0% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
  50% { box-shadow: 0 0 18px rgba(0,150,255,0.55); }
  100% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
}

@keyframes pulse-orange {
  0% { box-shadow: 0 0 0px rgba(255,140,0,0.25); }
  50% { box-shadow: 0 0 18px rgba(255,140,0,0.55); }
  100% { box-shadow: 0 0 0px rgba(255,140,0,0.25); }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
  50% { box-shadow: 0 0 18px rgba(255,0,0,0.55); }
  100% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0px rgba(0,255,180,0.25); }
  50% { box-shadow: 0 0 18px rgba(0,255,180,0.55); }
  100% { box-shadow: 0 0 0px rgba(0,255,180,0.25); }
}

.ai-pulse-blue {
  animation: pulse-blue 3.2s ease-in-out infinite;
  border-color: rgba(0,150,255,0.45) !important;
}

.ai-pulse-orange {
  animation: pulse-orange 3.2s ease-in-out infinite;
  border-color: rgba(255,140,0,0.45) !important;
}

.ai-pulse-red {
  animation: pulse-red 3.2s ease-in-out infinite;
  border-color: rgba(255,0,0,0.45) !important;
}

.ai-pulse-green {
  animation: pulse-green 3.2s ease-in-out infinite;
  border-color: rgba(0,255,180,0.45) !important;
}
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = pulseStyles;
  document.head.appendChild(styleTag);
}

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Trade = {
  ticker: string;
  side: string;
  entry: number;
  tp: number;
  stop: number;
  timestamp?: string;
  type?: string;
};

type Derived = {
  units: number;
  position_value: number;
  required_margin: number;
};

// ------------------------------------------------------------
// SUPABASE
// ------------------------------------------------------------
const ETH_TRADE_ROW_ID = "0fee5c83-f233-4487-bc5f-f7e703a14024";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function ETHUSDT_TradeOutputCard() {
  const [trade, setTrade] = useState<Trade>({
    ticker: "",
    side: "",
    entry: 0,
    tp: 0,
    stop: 0,
    timestamp: "",
    type: "",
  });

  const [derived, setDerived] = useState<Derived>({
    units: 0,
    position_value: 0,
    required_margin: 0,
  });

  const [leverage, setLeverage] = useState<number>(1);
  const [marginFromAi, setMarginFromAi] = useState<number>(0);

  // ✅ Explicitly typed animation states
  const [animTrade, setAnimTrade] = useState<Trade>(trade);
  const [animDerived, setAnimDerived] = useState<Derived>(derived);

  const prevTrade = useRef<Trade>(trade);
  const prevDerived = useRef<Derived>(derived);

  const [flash, setFlash] = useState<string>("");

  const lastTimestampRef = useRef<string | null>(null);
  const lastTradeRef = useRef<Trade | null>(null);

  const isSameTrade = (a: Trade | null, b: Trade) =>
    !!a &&
    a.ticker === b.ticker &&
    a.side === b.side &&
    a.entry === b.entry &&
    a.stop === b.stop &&
    a.tp === b.tp &&
    a.type === b.type;

  const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

  const fmtPrice = (n: number, decimals = 2) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // ------------------------------------------------------------
  // COPY BUTTON (raw number copy)
  // ------------------------------------------------------------
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
          ${
            copied
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

  // ------------------------------------------------------------
  // LOAD LEVERAGE + MARGIN FROM ETH AI CARD
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const storedLev = localStorage.getItem("eth_leverage");
      const storedMargin = localStorage.getItem("eth_required_margin");

      if (storedLev) setLeverage(parseFloat(storedLev));
      if (storedMargin) setMarginFromAi(parseFloat(storedMargin));
    } catch {}
  }, []);

  // Sync leverage + margin every second
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const storedLev = localStorage.getItem("eth_leverage");
        const storedMargin = localStorage.getItem("eth_required_margin");

        if (storedLev) {
          const parsedLev = parseFloat(storedLev);
          setLeverage((prev) => (prev !== parsedLev ? parsedLev : prev));
        }

        if (storedMargin) {
          const m = parseFloat(storedMargin);
          setMarginFromAi((prev) => (prev !== m ? m : prev));
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // LOAD TRADE + DERIVED FROM SUPABASE
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchTrade = async () => {
      const { data, error } = await supabase
        .from("ETHUSDT_trades")
        .select("*")
        .eq("id", ETH_TRADE_ROW_ID)
        .single();

      if (error || !data) return;

      const d = data as any;

      const newTrade: Trade = {
        ticker: d.ticker ?? "ETHUSDT",
        side: d.side ?? "",
        entry: d.entry ?? 0,
        tp: d.tp ?? 0,
        stop: d.stop ?? 0,
        timestamp: d.timestamp ?? "",
        type: d.type ?? "",
      };

      const newDerived: Derived = {
        units: d.units ?? 0,
        position_value: d.position_value ?? 0,
        required_margin: d.required_margin ?? 0,
      };

      // Only animate if trade actually changed
      if (!isSameTrade(lastTradeRef.current, newTrade)) {
        lastTradeRef.current = newTrade;
        lastTimestampRef.current = newTrade.timestamp ?? null;

        setTrade(newTrade);
        setDerived(newDerived);

        // Trigger flash class based on side
        if (newTrade.side === "BUY") {
          setFlash("ai-pulse-green");
        } else if (newTrade.side === "SELL") {
          setFlash("ai-pulse-red");
        } else {
          setFlash("ai-pulse-blue");
        }

        // Smooth animation from previous to new
        const steps = 18;
        const duration = 420;
        const interval = duration / steps;

        const startTrade = prevTrade.current;
        const startDerived = prevDerived.current;

        let currentStep = 0;

        const animInterval = setInterval(() => {
          currentStep += 1;
          const t = currentStep / steps;

          const lerp = (a: number, b: number) => a + (b - a) * t;

          const nextAnimTrade: Trade = {
            ticker: newTrade.ticker,
            side: newTrade.side,
            entry: lerp(startTrade.entry, newTrade.entry),
            tp: lerp(startTrade.tp, newTrade.tp),
            stop: lerp(startTrade.stop, newTrade.stop),
            timestamp: newTrade.timestamp,
            type: newTrade.type,
          };

          const nextAnimDerived: Derived = {
            units: lerp(startDerived.units, newDerived.units),
            position_value: lerp(
              startDerived.position_value,
              newDerived.position_value
            ),
            required_margin: lerp(
              startDerived.required_margin,
              newDerived.required_margin
            ),
          };

          setAnimTrade(nextAnimTrade);
          setAnimDerived(nextAnimDerived);

          if (currentStep >= steps) {
            clearInterval(animInterval);
            prevTrade.current = newTrade;
            prevDerived.current = newDerived;
          }
        }, interval);
      }
    };

    fetchTrade();

    const interval = setInterval(fetchTrade, 5000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <GTCard
      title="ETHUSDT Trade Output"
      className={`border-2 ${flash} transition-all duration-500`}
    >
      <div className="space-y-4 text-sm text-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Latest AI Trade
            </div>
            <div className="mt-1 text-lg font-semibold">
              {animTrade.ticker || "ETHUSDT"}{" "}
              <span
                className={
                  animTrade.side === "BUY"
                    ? "text-emerald-400"
                    : animTrade.side === "SELL"
                    ? "text-red-400"
                    : "text-slate-300"
                }
              >
                {animTrade.side || "WAITING"}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>{animTrade.timestamp || "No timestamp"}</div>
            <div className="mt-1">
              Type:{" "}
              <span className="font-medium text-slate-200">
                {animTrade.type || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 rounded-md bg-slate-900/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Core Levels
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Entry</span>
                <span className="font-semibold text-emerald-300">
                  {fmtPrice(animTrade.entry)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Stop Loss</span>
                <span className="font-semibold text-red-300">
                  {fmtPrice(animTrade.stop)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Take Profit</span>
                <span className="font-semibold text-amber-300">
                  {fmtPrice(animTrade.tp)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-md bg-slate-900/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Position Metrics
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Units</span>
                <span className="font-semibold text-slate-100">
                  {fmtInt(animDerived.units)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Position Value</span>
                <span className="font-semibold text-slate-100">
                  ${fmtInt(animDerived.position_value)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Required Margin</span>
                <span className="font-semibold text-emerald-300">
                  ${fmtInt(animDerived.required_margin)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-md bg-slate-900/40 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Leverage & Margin Sync
            </div>
            <div className="text-xs text-slate-400">
              From ETH AI Card (localStorage)
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Leverage</span>
              <span className="font-semibold text-slate-100">
                {leverage}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Required Margin (AI)</span>
              <span className="font-semibold text-emerald-300">
                ${fmtInt(marginFromAi)}
              </span>
              <CopyBtn val={marginFromAi} />
            </div>
          </div>
        </div>
      </div>
    </GTCard>
  );
}
