"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getRandomMessage } from "app/dashboard/products/TOOLS/Ai_Text";

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
// COLOR GRADIENT
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
// STOPWATCH DONUT (B1 + H1)
// ------------------------------------------------------------
function StopwatchDonut({
  percent,
  timeLeftText,
}: {
  percent: number;
  timeLeftText: string;
}) {
  const radius = 70;
  const strokeWidth = 14;
  const size = radius * 2 + strokeWidth * 2;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const arcOffset = circumference - (percent / 100) * circumference;

  const strokeColor = getGradientColor(percent);
  const glow = `0 0 12px ${strokeColor}`;

  // needle rotation (0–360 degrees)
  const rotation = (1 - percent / 100) * 360;

  return (
    <div className="flex justify-center py-4">
      <svg
        width={size}
        height={size}
        style={{ filter: `drop-shadow(${glow})` }}
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Remaining arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={arcOffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />

        {/* Stopwatch needle */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius + 6}
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${center} ${center})`}
        />

        {/* TIME LEFT INSIDE DONUT */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="1.8em"
          className="fill-slate-200 text-lg font-semibold"
        >
          {timeLeftText}
        </text>
      </svg>
    </div>
  );
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function SWING_NewsCard() {
  const [ticker, setTicker] = useState("Waiting...");
  const [entryWindowText, setEntryWindowText] = useState("4h 0m");
  const [holdDurationText, setHoldDurationText] = useState("12h 0m");
  const [riskWindowNote, setRiskWindowNote] = useState("Good to enter anytime");

  const [entryPercent, setEntryPercent] = useState(100);
  const [entryTimestamp, setEntryTimestamp] = useState<number | null>(null);
  const [position, setPosition] = useState<"flat" | "long" | "short">("flat");

  const [timeLeftText, setTimeLeftText] = useState("4h 0m");

  const [aiMessage] = useState(getRandomMessage());
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600);

  // ------------------------------------------------------------
  // READ LOCAL SNAPSHOT
  // ------------------------------------------------------------
  function readLocalTradeState() {
    try {
      const raw = localStorage.getItem("SWING_trade_state");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function formatHM(ms: number) {
    if (ms <= 0) return "0m";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  // ------------------------------------------------------------
  // INITIAL + STORAGE SUBSCRIBE
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const applyState = (s: any | null) => {
      if (!s || !mounted) return;

      const posRaw = (s.position ?? "flat").toLowerCase();
      const pos =
        posRaw === "long" ? "long" : posRaw === "short" ? "short" : "flat";

      setPosition(pos);
      setTicker(pos === "flat" ? "Waiting..." : s.ticker ?? "Waiting...");
      setEntryTimestamp(
        s.entryTimestamp ? Date.parse(s.entryTimestamp) : null
      );
    };

    applyState(readLocalTradeState());

    const onStorage = () => applyState(readLocalTradeState());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  // ------------------------------------------------------------
  // COUNTDOWN + STOPWATCH LOGIC
  // ------------------------------------------------------------
  useEffect(() => {
    const FOUR_H = 4 * 60 * 60 * 1000;
    const TWELVE_H = 12 * 60 * 60 * 1000;

    const tick = () => {
      if (!entryTimestamp) {
        setEntryPercent(100);
        setTimeLeftText("4h 0m");
        setHoldDurationText("12h 0m");
        return;
      }

      const now = Date.now();
      const elapsed = now - entryTimestamp;

      // ENTRY WINDOW
      const remainingEntryMs = Math.max(0, FOUR_H - elapsed);
      const percent = Math.max(
        0,
        Math.min(100, (remainingEntryMs / FOUR_H) * 100)
      );
      setEntryPercent(percent);

      setTimeLeftText(
        remainingEntryMs > 0 ? formatHM(remainingEntryMs) : "Expired"
      );

      // HOLD DURATION
      const remainingHoldMs = Math.max(0, TWELVE_H - elapsed);
      setHoldDurationText(
        remainingHoldMs > 0 ? formatHM(remainingHoldMs) : "Completed"
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
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
          <span className="text-lg font-semibold text-slate-50">{ticker}</span>
        </div>

        {/* ENTRY WINDOW */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">
          <span className="block text-xl font-semibold text-emerald-400">
            Entry Window
          </span>
          <span className="block text-lg font-semibold text-slate-50">
            {entryTimestamp ? `Valid for ${timeLeftText}` : "Valid for 4h 0m"}
          </span>
        </div>

        {/* HOLD DURATION */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="block text-lg font-semibold text-blue-300">
            Hold Duration: {holdDurationText}
          </span>
        </div>

        {/* STOPWATCH DONUT */}
        <div className="rounded-xl border border-emerald-500/20 p-4 bg-[#050509]">
          <StopwatchDonut percent={entryPercent} timeLeftText={timeLeftText} />

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
