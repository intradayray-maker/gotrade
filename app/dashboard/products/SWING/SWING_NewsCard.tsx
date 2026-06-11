"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getRandomMessage } from "app/dashboard/products/TOOLS/Ai_Text";
import { getBrowserSupabase } from "@/lib/supabase/browserClient";

const supabase = getBrowserSupabase();

// ------------------------------------------------------------
// TYPING EFFECT
// ------------------------------------------------------------
function useTypingEffect(text: string, speed = 35, delay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let i = 0;

    const start = setTimeout(() => {
      const tick = () => {
        setDisplayed(text.slice(0, i));
        i++;
        if (i <= text.length) {
          setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      tick();
    }, delay);

    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return { displayed, done };
}

// ------------------------------------------------------------
// COLOR GRADIENT LOGIC (green → orange → red)
// ------------------------------------------------------------
function getGradientColor(percent: number) {
  const clamp = (v: number) => Math.min(100, Math.max(0, v));
  percent = clamp(percent);

  const green = { r: 16, g: 185, b: 129 };
  const orange = { r: 245, g: 158, b: 11 };
  const red = { r: 239, g: 68, b: 68 };

  let start, end, t;

  if (percent > 50) {
    start = green;
    end = orange;
    t = (100 - percent) / 50;
  } else {
    start = orange;
    end = red;
    t = (50 - percent) / 50;
  }

  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// ------------------------------------------------------------
// DONUT COUNTDOWN
// ------------------------------------------------------------
function DonutCountdown({ percent }: { percent: number }) {
  const radius = 70;
  const strokeWidth = 14;
  const size = radius * 2 + strokeWidth * 2;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const strokeColor = getGradientColor(percent);
  const glow = `0 0 12px ${strokeColor}`;

  return (
    <div className="flex justify-center py-4">
      <svg width={size} height={size} style={{ filter: `drop-shadow(${glow})` }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          className="fill-slate-200 text-3xl font-bold"
        >
          {Math.round(percent)}%
        </text>
      </svg>
    </div>
  );
}

// ------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------
const SWING_NEWS_ROW_ID = "REPLACE-WITH-YOUR-UUID";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function SWING_NewsCard() {
  const [ticker, setTicker] = useState("ETHUSDT");

  const [entryWindowText, setEntryWindowText] = useState("4h 0m");
  const [holdDurationText, setHoldDurationText] = useState("1–3 days");
  const [riskWindowNote, setRiskWindowNote] = useState("Good to enter anytime");

  const [entryPercent, setEntryPercent] = useState(100);
  const [entryTimestamp, setEntryTimestamp] = useState<number | null>(null);

  const [aiMessage] = useState(getRandomMessage());
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600);

  // ------------------------------------------------------------
  // SUPABASE FETCH
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      // 1. Swing Meta
      const { data: meta } = await supabase
        .from("SWING_news_state")
        .select("entry_window_text, hold_duration_text, risk_window_note")
        .eq("id", SWING_NEWS_ROW_ID)
        .single();

      if (mounted && meta) {
        setEntryWindowText(meta.entry_window_text || "4h 0m");
        setHoldDurationText(meta.hold_duration_text || "1–3 days");
        setRiskWindowNote(meta.risk_window_note || "Good to enter anytime");
      }

      // 2. Latest trade (ticker + timestamp)
      const { data: trade } = await supabase
        .from("SWING_trades_state")
        .select("timestamp, ticker")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (mounted && trade) {
        if (trade.ticker) {
          setTicker(`${trade.ticker}`);
        }
        if (trade.timestamp) {
          setEntryTimestamp(Date.parse(trade.timestamp));
        }
      }
    };

    fetchInitial();

    return () => {
      mounted = false;
    };
  }, []);

  // ------------------------------------------------------------
  // COUNTDOWN LOGIC
  // ------------------------------------------------------------
  useEffect(() => {
    if (!entryTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - entryTimestamp;
      const total = 240 * 60 * 1000;

      let percent = 100 - (elapsed / total) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      setEntryPercent(percent);
    }, 1000);

    return () => clearInterval(interval);
  }, [entryTimestamp]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Swing Entry Status
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* TICKER */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            {ticker}
          </span>
        </div>

        {/* ENTRY WINDOW */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">
          <span className="block text-xl font-semibold text-emerald-400">
            Entry Window
          </span>
          <span className="block text-lg font-semibold text-slate-50">
            Valid for {entryWindowText}
          </span>
        </div>

        {/* HOLD DURATION */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="block text-lg font-semibold text-blue-300">
            Hold Duration: {holdDurationText}
          </span>
        </div>

        {/* DONUT */}
        <div className="rounded-xl border border-emerald-500/20 p-4 bg-[#050509]">
          <DonutCountdown percent={entryPercent} />
          <p className="mt-2 text-xs text-slate-400 text-center">
            Entry window closes as the ring empties.
          </p>
        </div>

        {/* RISK WINDOW NOTE */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="block text-sm font-semibold text-amber-300">
            Risk Window
          </span>
          <span className="block text-sm text-slate-300">
            {riskWindowNote}
          </span>
        </div>

      </div>
    </GTCard>
  );
}
