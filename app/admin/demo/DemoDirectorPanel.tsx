"use client"

import { useDemoState } from "./demoState"
import { ArrowUp, ArrowDown, Plus, Minus } from "lucide-react"
import { playVoice } from "@/app/admin/demo/TOOLS/Demo_AiVoice"

import Link from "next/link"
import {
  Squares2X2Icon,
  WrenchScrewdriverIcon,
  HomeIcon
} from "@heroicons/react/24/outline"

// ------------------------------------------------------------
// FLOATING DIRECTOR PANEL (GOTRADE THEME)
// ------------------------------------------------------------
export default function DemoDirectorPanel() {
  const {
    trade,
    setTradeType,
    setTradeSide,

    news,
    setImpact,
    setNewsToday,
  } = useDemoState()

  // ------------------------------------------------------------
  // GOTRADE COLOR BUTTONS (BIGGER + GLOW)
  // ------------------------------------------------------------
  const baseBtn =
    "w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer select-none"

  const gtBlue =
    "bg-[rgb(3,82,165)] text-white shadow-[0_0_12px_rgba(3,82,165,0.65)] border border-[rgba(3,82,165,0.8)]"

  const gtGreen =
    "bg-[rgb(3,82,65)] text-[rgb(225,254,234)] shadow-[0_0_12px_rgba(3,82,65,0.65)] border border-[rgba(3,82,65,0.8)]"

  const gtRed =
    "bg-[rgb(84,33,33)] text-[rgb(255,230,230)] shadow-[0_0_12px_rgba(84,33,33,0.65)] border border-[rgba(84,33,33,0.8)]"

  const inactive =
    "bg-[#0f0f16] text-slate-500 border border-[#1a1a22] hover:bg-[#1a1a22]"

  // ------------------------------------------------------------
  // RENDER (FREE FLOATING BUTTONS)
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col gap-8 w-[70px]">

      {/* ------------------------------------------------------ */}
      {/* TRADE TYPE                                              */}
      {/* ------------------------------------------------------ */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[10px] tracking-wide text-slate-500">TRADE</p>

        {/* LONG ENTRY */}
        <button
          onClick={() => {
            setTradeSide("long")
            setTradeType("entry_long")
            playVoice("long")
          }}
          className={`${baseBtn} ${
            trade.type === "entry_long" ? gtBlue : inactive
          }`}
        >
          <ArrowUp size={20} />
        </button>

        {/* SHORT ENTRY */}
        <button
          onClick={() => {
            setTradeSide("short")
            setTradeType("entry_short")
            playVoice("short")
          }}
          className={`${baseBtn} ${
            trade.type === "entry_short" ? gtRed : inactive
          }`}
        >
          <ArrowDown size={20} />
        </button>

        {/* TAKE PROFIT */}
        <button
          onClick={() => {
            setTradeType("tp")
            playVoice("tp")
          }}
          className={`${baseBtn} ${
            trade.type === "tp" ? gtGreen : inactive
          }`}
        >
          <Plus size={20} />
        </button>

        {/* STOP LOSS */}
        <button
          onClick={() => {
            setTradeType("sl")
            playVoice("sl")
          }}
          className={`${baseBtn} ${
            trade.type === "sl" ? gtRed : inactive
          }`}
        >
          <Minus size={20} />
        </button>
      </div>

      {/* ------------------------------------------------------ */}
      {/* IMPACT (REPLACED WITH NAV ICONS)                       */}
      {/* ------------------------------------------------------ */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[10px] tracking-wide text-slate-500">LINKS</p>

        {/* DASHBOARD */}
        <Link
          href="/dashboard"
          className={`${baseBtn} ${gtBlue}`}
        >
          <Squares2X2Icon className="h-5 w-5" />
        </Link>

        {/* ADMIN TOOLS */}
        <Link
          href="/admin"
          className={`${baseBtn} ${gtGreen}`}
        >
          <WrenchScrewdriverIcon className="h-5 w-5" />
        </Link>

        {/* PUBLIC HOME */}
        <Link
          href="/"
          className={`${baseBtn} ${gtRed}`}
        >
          <HomeIcon className="h-5 w-5" />
        </Link>
      </div>

      {/* ------------------------------------------------------ */}
      {/* NEWS TIMING (NOW / 3H / TMR)                            */}
      {/* ------------------------------------------------------ */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[10px] tracking-wide text-slate-500">NEWS</p>

        <button
          onClick={() => setNewsToday("now")}
          className={`${baseBtn} ${
            news.today === "now" ? gtBlue : inactive
          }`}
        >
          Now
        </button>

        <button
          onClick={() => setNewsToday("3h")}
          className={`${baseBtn} ${
            news.today === "3h" ? gtGreen : inactive
          }`}
        >
          3h
        </button>

        <button
          onClick={() => setNewsToday("tmr")}
          className={`${baseBtn} ${
            news.today === "tmr" ? gtRed : inactive
          }`}
        >
          Tmr
        </button>
      </div>

    </div>
  )
}
