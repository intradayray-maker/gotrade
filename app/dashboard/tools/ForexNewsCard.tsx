// app/dashboard/tools/ForexNewsCard.tsx

"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";

export default function ForexNewsCard() {
  const [newsTime] = useState("8:30 AM");
  const [newsDate] = useState("Wed Jun 3");
  const [newsMessage] = useState(
    "No trades before news event today. Trading resumes following event."
  );

  const [session, setSession] = useState("Asian");

  useEffect(() => {
    const updateSession = () => {
      const now = new Date();

      // New York hour (EST/EDT)
      const nyHour = parseInt(
        now.toLocaleString("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "America/New_York",
        })
      );

      // New York weekday (0=Sunday, 6=Saturday)
      const nyDay = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      ).getDay();

      // Weekend closure
      if (nyDay === 6 || nyDay === 0) {
        setSession("Closed");
        return;
      }

      // Sydney: 5 PM – 2 AM NY time
      if (nyHour >= 17 || nyHour < 2) {
        setSession("Sydney");
        return;
      }

      // Tokyo: 7 PM – 4 AM NY time
      if (nyHour >= 19 || nyHour < 4) {
        setSession("Tokyo");
        return;
      }

      // London: 3 AM – 8 AM NY time
      if (nyHour >= 3 && nyHour < 8) {
        setSession("London");
        return;
      }

      // New York: 8 AM – 5 PM NY time
      if (nyHour >= 8 && nyHour < 17) {
        setSession("NewYork");
        return;
      }

      setSession("OffHours");
    };

    updateSession();
    const t = setInterval(updateSession, 60000);
    return () => clearInterval(t);
  }, []);

  const getSessionDot = () => {
    if (session === "NewYork") return <span className="text-emerald-400">●</span>;
    if (session === "London") return <span className="text-emerald-400">●</span>;
    if (session === "Tokyo") return <span className="text-yellow-400">●</span>;
    if (session === "Sydney") return <span className="text-yellow-400">●</span>;
    if (session === "Closed") return <span className="text-red-400">●</span>;
    return <span className="text-slate-500">●</span>;
  };

  const getSessionLabel = () => {
    if (session === "NewYork") return "New York";
    if (session === "London") return "London";
    if (session === "Tokyo") return "Tokyo";
    if (session === "Sydney") return "Sydney";
    if (session === "Closed") return "Market Closed";
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
            EURUSD
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Price Source:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            OANDA
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
