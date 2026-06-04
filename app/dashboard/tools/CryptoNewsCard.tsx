"use client"

import { useState, useEffect } from "react"

export default function DailyAllocationCard() {

  // These will later come from Pine Script
  const [newsTime, setNewsTime] = useState("8:30 AM")
  const [newsDate, setNewsDate] = useState("Wed Jun 3")
  const [newsMessage, setNewsMessage] = useState(
    "No trades before news event today. Trading resumes following event."
  )

  // ==========================
  // DYNAMIC SESSION DETECTION (EST) ///test
  // ==========================
  const [session, setSession] = useState("Asian")

  useEffect(() => {
    const updateSession = () => {
      const now = new Date()
      const estHour = now.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/New_York"
      })

      const h = parseInt(estHour)

      if (h >= 20 || h < 3) setSession("Asian")
      else if (h >= 3 && h < 8) setSession("London")
      else if (h >= 8 && h < 17) setSession("NewYork")
      else setSession("OffHours")
    }

    updateSession()
    const t = setInterval(updateSession, 60000)
    return () => clearInterval(t)
  }, [])

  // Session color logic
  const getSessionDot = () => {
    if (session === "NewYork") return <span className="text-emerald-400">●</span>
    if (session === "London") return <span className="text-emerald-400">●</span>
    if (session === "Asian") return <span className="text-yellow-400">●</span>
    return <span className="text-slate-500">●</span>
  }

  const getSessionLabel = () => {
    if (session === "NewYork") return "New York"
    if (session === "London") return "London"
    if (session === "Asian") return "Asian"
    return "Off Hours"
  }

  // Determine if news is today
  const todayString = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  })

  const isToday = newsDate === todayString

  return (
    <div
      className="
      relative
      rounded-xl
      p-[2px]
      bg-gradient-to-br
      from-emerald-500/40
      via-teal-400/40
      to-emerald-600/40
      shadow-[0_0_25px_rgba(0,0,0,0.5)]
      "
    >
      <div
        className="
        rounded-xl
        bg-[#0b0b12]
        p-4
        h-full
        flex
        flex-col
        gap-4
        "
      >

        <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
          Daily System Info
        </p>

        <div className="space-y-3 flex-1 flex flex-col">

          {/* 1 — TODAY'S TICKER */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Today's Ticker:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              EURUSD
            </span>
          </div>

          {/* 2 — BOT'S BROKER */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Price Source:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              OANDA
            </span>
          </div>

          {/* 3 — NEWS CELL 1 */}
          <div className="p-3 rounded-lg border border-slate-700/40 bg-black/20 text-center">
            <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
              High Impact News Today ❗
            </span>
          </div>

          {/* 4 — NEWS CELL 2 */}
          <div className="p-3 rounded-lg border border-slate-700/40 bg-black/20 text-center">
            <span className="text-xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]">
              {isToday ? "Today" : newsDate} at {newsTime}
            </span>
          </div>

          {/* 5 — CURRENT SESSION */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Current Session:</span>

            <span className="text-xl font-semibold text-slate-50 tabular-nums flex items-center gap-2">
              {getSessionDot()}
              {getSessionLabel()}
            </span>
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* 6 — MESSAGE (BOTTOM) */}
          <div className="p-3 rounded-lg border border-slate-700/40 bg-black/20 mt-auto">
            <p className="text-slate-300 text-sm leading-relaxed">
              {newsMessage}
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
