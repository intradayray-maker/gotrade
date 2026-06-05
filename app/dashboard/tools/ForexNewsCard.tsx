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

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">
      {/* Header */}
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily Risk Status
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* Ticker + Source */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            EURUSD • OANDA
          </span>
        </div>

        {/* Combined News Cell */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">
          {newsToday ? (
            <>
              <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
                ⚠️ NEWS TODAY
              </span>
              <span className="text-lg font-semibold text-slate-50">
                at {nextNewsTime.replace("Today, ", "")}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl font-semibold text-emerald-400">
                ✓ No News Today
              </span>
              <span className="text-sm text-slate-400 italic">
                next: {nextNewsTime}
              </span>
            </>
          )}
        </div>

        {/* Safe / Unsafe */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span
            className={`text-lg font-semibold ${
              windowActive ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {windowActive ? "Avoid trading — news window active" : "Safe to take trades"}
          </span>
        </div>

        {/* Countdown */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            Countdown: {formatCountdown(countdown)}
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
