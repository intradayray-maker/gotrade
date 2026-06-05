"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";

export default function ForexNewsCard() {
  const [nextNewsTime, setNextNewsTime] = useState("None");
  const [newsToday, setNewsToday] = useState(false);
  const [windowActive, setWindowActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ------------------------------------------------------------
  // FETCH NEWS FROM BACKEND
  // ------------------------------------------------------------
  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      try {
        const res = await fetch("/api/trade", { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        const trade = json?.trade ?? json;

        if (!trade || typeof trade !== "object") return;
        if (!active) return;

        setNextNewsTime(trade.next_news_time ?? "None");
        setNewsToday(Boolean(trade.news_today));
        setWindowActive(Boolean(trade.news_window_active));
        setCountdown(Number(trade.news_countdown ?? 0));
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // ------------------------------------------------------------
  // LIVE COUNTDOWN (ticks every second)
  // ------------------------------------------------------------
  useEffect(() => {
    if (countdown <= 0) return;

    const t = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [countdown]);

  // Format countdown
  const formatCountdown = (sec: number) => {
    if (sec <= 0) return "—";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  // Extract "Today, Jun 05 6:43PM" → "6:43PM"
  const cleanTime = nextNewsTime.replace("Today, ", "");

  return (
    <GTCard className="flex h-full flex-col gap-4">
      {/* Header */}
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily News Status
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* Ticker + Source */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            EURUSD • OANDA
          </span>
        </div>

        {/* ------------------------------------------------------------
            COMBINED NEWS CELL (all scenarios)
        ------------------------------------------------------------ */}
<div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">

  {/* SCENARIO 1 — NEWS TODAY (UPCOMING) */}
  {newsToday && countdown > 0 && (
    <>
      <span className="block text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
        ⚠️ NEWS TODAY
      </span>

      <span className="block text-lg font-semibold text-slate-50">
        {cleanTime} est
      </span>
    </>
  )}

  {/* SCENARIO 2 — NEWS TODAY (ALREADY PASSED) */}
  {newsToday && countdown === 0 && (
    <>
      <span className="block text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
        ⚠️ NEWS WAS TODAY
      </span>

      <span className="block text-lg font-semibold text-slate-50">
        Occurred at {cleanTime} est
      </span>

      <span className="block text-sm text-red-300 italic">
        next event: {nextNewsTime} est
      </span>
    </>
  )}

  {/* SCENARIO 3 — NO NEWS TODAY */}
  {!newsToday && (
    <>
      <span className="block text-xl font-semibold text-emerald-400">
        ✓ No News Today
      </span>

      <span className="block text-sm text-slate-400 italic">
        next event: {nextNewsTime} est
      </span>
    </>
  )}

</div>


{/* Safe / Unsafe */}
<div className="rounded-xl border border-emerald-500/20 p-3 text-center">
  {windowActive ? (
    <span className="block text-lg font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
      ⚠️ Avoid trading — news window active
    </span>
  ) : (
    <span className="block text-lg font-semibold text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,0,0.35)]">
      🟢 Safe to take trades
    </span>
  )}
</div>


{/* Countdown */}
<div className="rounded-xl border border-emerald-500/20 p-3 text-center">
  <span className="block text-lg font-semibold text-blue-300 drop-shadow-[0_0_6px_rgba(0,5,255,0.35)]">
    {formatCountdown(countdown)} until next event
  </span>
</div>

        <div className="flex-1" />

        {/* Instructions */}
        <div className="mt-auto rounded-xl border border-emerald-500/20 p-3">
          <p className="text-xs leading-relaxed text-slate-300">
            {newsToday
              ? "Exit all positions 15 minutes before news to avoid unexpected loss!"
              : "Normal trading conditions."}
          </p>
        </div>
      </div>
    </GTCard>
  );
}
