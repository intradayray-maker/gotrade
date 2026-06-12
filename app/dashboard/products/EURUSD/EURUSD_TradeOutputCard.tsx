// app/dashboard/products/EURUSD/EURUSD_TradeOutputCard.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getBrowserSupabase } from "@/lib/supabase/browserClient";

// ------------------------------------------------------------
// SUPABASE CLIENT (single shared instance)
// ------------------------------------------------------------
const supabase = getBrowserSupabase();

// ------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------
const EURUSD_TRADE_ROW_ID = "5726f12d-46d7-4e03-8131-a1febfd7ae42";

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

.ai-pulse-blue { animation: pulse-blue 3.2s ease-in-out infinite; border-color: rgba(0,150,255,0.45) !important; }
.ai-pulse-orange { animation: pulse-orange 3.2s ease-in-out infinite; border-color: rgba(255,140,0,0.45) !important; }
.ai-pulse-red { animation: pulse-red 3.2s ease-in-out infinite; border-color: rgba(255,0,0,0.45) !important; }
.ai-pulse-green { animation: pulse-green 3.2s ease-in-out infinite; border-color: rgba(0,255,180,0.45) !important; }
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = pulseStyles;
  document.head.appendChild(styleTag);
}

// ------------------------------------------------------------
// COPY BUTTON HOOK + COMPONENT
// ------------------------------------------------------------
function useCopy() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (label: string, value: string | number) => {
    try {
      navigator.clipboard.writeText(String(value));
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1200);
    } catch {}
  };

  return { copiedField, copy };
}

function CopyButton({
  label,
  value,
  copiedField,
  onCopy,
}: {
  label: string;
  value: string | number;
  copiedField: string | null;
  onCopy: (label: string, value: string | number) => void;
}) {
  const isCopied = copiedField === label;

  return (
    <button
      onClick={() => onCopy(label, value)}
      className={`
        ml-3 px-2 py-1 rounded-md text-xs font-semibold
        transition-all duration-300
        ${
          isCopied
            ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,180,0.45)]"
            : "text-slate-400 bg-slate-700/20 border border-slate-600/30 hover:bg-slate-700/40"
        }
      `}
    >
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function EURUSD_TradeOutputCard() {
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

  const [leverage, setLeverage] = useState(1);
  const [marginFromAi, setMarginFromAi] = useState(0);

  const [animTrade, setAnimTrade] = useState(trade);
  const [animDerived, setAnimDerived] = useState(derived);

  const prevTrade = useRef(trade);
  const prevDerived = useRef(derived);

  const [flash, setFlash] = useState("");

  const lastTradeRef = useRef<Trade | null>(null);

  const { copiedField, copy } = useCopy();

  const isSameTrade = (a: Trade | null, b: Trade) =>
    a &&
    a.ticker === b.ticker &&
    a.side === b.side &&
    a.entry === b.entry &&
    a.stop === b.stop &&
    a.tp === b.tp &&
    a.type === b.type;

  const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
  const fmtPrice = (n: number, decimals = 5) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // ------------------------------------------------------------
  // LOAD LEVERAGE + MARGIN FROM AI CARD
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const lev = localStorage.getItem("forex_leverage");
      const m = localStorage.getItem("forex_required_margin");
      if (lev) setLeverage(parseFloat(lev));
      if (m) setMarginFromAi(parseFloat(m));
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const lev = localStorage.getItem("forex_leverage");
        const m = localStorage.getItem("forex_required_margin");

        if (lev) {
          const parsedLev = parseFloat(lev);
          setLeverage((prev) => (prev !== parsedLev ? parsedLev : prev));
        }

        if (m) {
          const parsed = parseFloat(m);
          setMarginFromAi((prev) => (prev !== parsed ? parsed : prev));
        }
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // INITIAL FETCH + REALTIME SUBSCRIPTION
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;
    let channel: any = null;

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("EURUSD_trades_state")
        .select("*")ticker, side, entry, stop, tp, timestamp, type")
        .eq("id", EURUSD_TRADE_ROW_ID)
        .single();

      if (!mounted || error || !data) return;

      const t: Trade = {
        ticker: data.ticker,
        side: data.side,
        entry: data.entry ?? 0,
        stop: data.stop ?? 0,
        tp: data.tp ?? 0,
        timestamp: data.timestamp,
        type: data.type,
      };

      if (isSameTrade(lastTradeRef.current, t)) return;

      lastTradeRef.current = t;
      setTrade(t);
    };

    fetchInitial();

    channel = supabase
      .channel("eurusd-trade-state-output-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "EURUSD_trades_state",
          filter: `id=eq.${EURUSD_TRADE_ROW_ID}`,
        },
        (payload: { new: Record<string, any> }) => {
          if (!mounted || !payload.new) return;

          const d = payload.new;

          const t: Trade = {
            ticker: d.ticker,
            side: d.side,
            entry: d.entry ?? 0,
            stop: d.stop ?? 0,
            tp: d.tp ?? 0,
            timestamp: d.timestamp,
            type: d.type,
          };

          if (isSameTrade(lastTradeRef.current, t)) return;

          lastTradeRef.current = t;
          setTrade(t);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // ------------------------------------------------------------
  // DERIVED CALCULATION
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // ANIMATION + FLASH
  // ------------------------------------------------------------
  const getPulseClass = () => {
    switch (animTrade.type) {
      case "entry_long":
        return "ai-pulse-blue";
      case "entry_short":
        return "ai-pulse-orange";
      case "sl":
        return "ai-pulse-red";
      case "tp":
        return "ai-pulse-green";
      default:
        return "";
    }
  };

  const getFlashClass = () => {
    switch (animTrade.type) {
      case "entry_long":
        return "bg-blue-950/30";
      case "entry_short":
        return "bg-orange-950/30";
      case "sl":
        return "bg-red-950/30";
      case "tp":
        return "bg-emerald-950/30";
      default:
        return "";
    }
  };

  useEffect(() => {
    const oldT = prevTrade.current;
    const newT = trade;
    const oldD = prevDerived.current;
    const newD = derived;

    if (newT.timestamp !== oldT.timestamp || newT.type !== oldT.type) {
      if (newT.type !== "bar") {
        setFlash(getFlashClass());
        setTimeout(() => setFlash(""), 300);
      }

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
          type: newT.type,
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

  // ------------------------------------------------------------
  // SIDE COLOR
  // ------------------------------------------------------------
  const getSideGlow = () => {
    if (animTrade.side === "long")
      return "text-[#4da3ff] drop-shadow-[0_0_6px_rgba(0,150,255,0.55)] uppercase";
    if (animTrade.side === "short")
      return "text-orange-400 drop-shadow-[0_0_6px_rgba(255,140,0,0.55)] uppercase";
    return "text-slate-500 uppercase";
  };

  const getEntryBorderGlow = () => {
    if (animTrade.side === "long")
      return "border-blue-500/40 shadow-[0_0_8px_rgba(0,150,255,0.45)]";
    if (animTrade.side === "short")
      return "border-orange-500/40 shadow-[0_0_8px_rgba(255,140,0,0.45)]";
    return "border-slate-600/20";
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <GTCard
      className={`
        flex h-full flex-col gap-4 border-2 rounded-xl transition-all
        ${getPulseClass()}
      `}
    >
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Trade Execution Details
      </p>

      <div className="space-y-3">
        {/* POSITION */}
        <div
          className={`
            flex items-center justify-between rounded-xl border border-slate-600/20 p-3 transition-all
            ${flash}
          `}
        >
          <span className="text-slate-400">Position:</span>
          <span className={`text-xl font-semibold tabular-nums ${getSideGlow()}`}>
            {animTrade.side || "--"}
          </span>
        </div>

        {/* TICKER */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-white">
            {animTrade.ticker || "--"}
          </span>
        </div>

        {/* UNITS */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Units:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {animDerived.units ? fmtInt(animDerived.units) : "--"}
            {animDerived.units > 0 && (
              <CopyButton
                label="units"
                value={animDerived.units}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>

        {/* TRADE AMOUNT */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Trade Amount:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {animDerived.position_value
              ? `$${fmtInt(animDerived.position_value)}`
              : "--"}
            {animDerived.position_value > 0 && (
              <CopyButton
                label="trade_amount"
                value={animDerived.position_value}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>

        {/* REQUIRED MARGIN */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Margin Used:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {animDerived.required_margin
              ? `$${fmtInt(animDerived.required_margin)}`
              : "--"}
            {animDerived.required_margin > 0 && (
              <CopyButton
                label="margin_used"
                value={animDerived.required_margin}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>

        {/* ENTRY PRICE */}
        <div
          className={`
            flex items-center justify-between rounded-xl p-3 transition-all
            ${getEntryBorderGlow()}
          `}
        >
          <span className="text-slate-400">Entry Price:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {animTrade.entry ? fmtPrice(animTrade.entry) : "--"}
            {animTrade.entry > 0 && (
              <CopyButton
                label="entry_price"
                value={animTrade.entry}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>

        {/* STOP LOSS */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Stop Loss:</span>
          <span className="text-xl font-semibold tabular-nums text-red-400 flex items-center">
            {animTrade.stop ? fmtPrice(animTrade.stop) : "--"}
            {animTrade.stop > 0 && (
              <CopyButton
                label="stop_loss"
                value={animTrade.stop}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>

        {/* TAKE PROFIT */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Take Profit:</span>
          <span className="text-xl font-semibold tabular-nums text-emerald-400 flex items-center">
            {animTrade.tp ? fmtPrice(animTrade.tp) : "--"}
            {animTrade.tp > 0 && (
              <CopyButton
                label="take_profit"
                value={animTrade.tp}
                copiedField={copiedField}
                onCopy={copy}
              />
            )}
          </span>
        </div>
      </div>
    </GTCard>
  );
}
