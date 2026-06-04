"use client";

import { useEffect, useState } from "react";

import GTCard from "@/components/ui/GTCard";

export default function DailyAllocationCard() {
  const [newsTime] = useState("8:30 AM");
  const [newsDate] = useState("Wed Jun 3");
  const [newsMessage] = useState(
    "No trades before news event today. Trading resumes following event."
  );

  const [session, setSession] = useState("Asian");

  useEffect(() => {
    const updateSession = () => {
      const now = new Date();
      const estHour = now.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/New_York",
      });

      const h = parseInt(estHour);

      if (h >= 20 || h < 3) setSession("Asian");
      else if (h >= 3 && h < 8) setSession("London");
      else if (h >= 8 && h < 17) setSession("NewYork");
      else setSession("OffHours");
    };

    updateSession();
    const t = setInterval(updateSession, 60000);
    return () => clearInterval(t);
  }, []);

  const getSessionDot = () => {
    if (session === "NewYork") return <span className="text-emerald-400">●</span>;
    if (session === "London") return <span className="text-emerald-400">●</span>;
    if (session === "Asian") return <span className="text-yellow-400">●</span>;
    return <span className="text-slate-500">●</span>;
  };

  const getSessionLabel = () => {
    if (session === "NewYork") return "New York";
    if (session === "London") return "London";
    if (session === "Asian") return "Asian";
    return "Off Hours";
  };

  const todayString = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const isToday = newsDate === todayString;

  return (
    <GTCard className="flex h-full flex-col gap-4">
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily System Info
      </p>

      <div className="flex flex-1 flex-col space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Today's Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            BTCUSD
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Price Source:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            BINANCE
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
            High Impact News Today ❗
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
            {isToday ? "Today" : newsDate} at {newsTime}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Current Session:</span>

          <span className="flex items-center gap-2 text-xl font-semibold tabular-nums text-slate-50">
            {getSessionDot()}
            {getSessionLabel()}
          </span>
        </div>

        <div className="flex-1" />

        <div className="mt-auto rounded-xl border border-emerald-500/20 p-3">
          <p className="text-sm leading-relaxed text-slate-300">{newsMessage}</p>
        </div>
      </div>
    </GTCard>
  );
}
