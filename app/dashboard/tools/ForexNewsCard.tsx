// app/dashboard/tools/ForexNewsCard.tsx

"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";

export default function ForexNewsCard() {
  const [news, setNews] = useState({
    headline: "No news today",
    instructions: "No trades before news event today. Trading resumes following event.",
    next: "None",
  });

  const [session, setSession] = useState("Asian");

  // ------------------------------------------------------------
  // FETCH NEWS FROM GOTRADE (ONCE PER HOUR)
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/trade", { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        if (!json.trade) return;

        setNews({
          headline: json.trade.news ?? "No news today",
          instructions: json.trade.instructions ?? "",
          next: json.trade.next_news ?? "None",
        });
      } catch (err) {
        console.error("News fetch failed:", err);
      }
    };

    fetchNews(); // initial load
    const interval = setInterval(fetchNews, 3600_000); // once per hour
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // SESSION DETECTION (unchanged)
  // ------------------------------------------------------------
  useEffect(() => {
    const updateSession = () => {
      const now = new Date();

      const nyHour = parseInt(
        now.toLocaleString("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "America/New_York",
        })
      );

      const nyDay = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      ).getDay();

      if (nyDay === 6 || nyDay === 0) {
        setSession("Closed");
        return;
      }

      if (nyHour >= 17 || nyHour < 2) {
        setSession("Sydney");
        return;
      }

      if (nyHour >= 19 || nyHour < 4) {
        setSession("Tokyo");
        return;
      }

      if (nyHour >= 3 && nyHour < 8) {
        setSession("London");
        return;
      }

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

  // ------------------------------------------------------------
  // PARSE NEWS HEADLINE INTO DATE + TIME
  // Example: "High Impact News Today at 8:30AM"
  // ------------------------------------------------------------
  const extractTime = (headline: string) => {
    const parts = headline.split(" at ");
    return parts.length === 2 ? parts[1] : "";
  };

  const newsTime = extractTime(news.headline);

  return (
    <GTCard className="flex h-full flex-col gap-4">
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily System Info
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* Ticker */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Today's Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            EURUSD
          </span>
        </div>

        {/* Price Source */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Price Source:</span>
          <span className="text-xl font-semibold tabular-nums text-slate-50">
            OANDA
          </span>
        </div>

        {/* News Header */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
            {news.headline.includes("No news") ? "No High Impact News" : "High Impact News Today ❗"}
          </span>
        </div>

        {/* News Time */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
            {newsTime || "—"}
          </span>
        </div>

        {/* Session */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 p-3">
          <span className="text-slate-400">Current Session:</span>

          <span className="flex items-center gap-2 text-xl font-semibold tabular-nums text-slate-50">
            {getSessionDot()}
            {getSessionLabel()}
          </span>
        </div>

        <div className="flex-1" />

        {/* Instructions */}
        <div className="mt-auto rounded-xl border border-emerald-500/20 p-3">
          <p className="text-sm leading-relaxed text-slate-300">
            {news.instructions}
          </p>
        </div>
      </div>
    </GTCard>
  );
}
