"use client"

import { useState, useEffect, useRef } from "react"
import GTSlider from "@/app/components/ui/GTSlider"

export default function AI_VoiceAssistantCard() {

  const [enabled, setEnabled] = useState(true)
  const [riskAmount, setRiskAmount] = useState(50)
  const [leverage, setLeverage] = useState(5)

  const [requiredMargin, setRequiredMargin] = useState(0)
  const [displayMargin, setDisplayMargin] = useState(0)

  const [flashColor, setFlashColor] = useState("") // green or red flash
  const prevMargin = useRef(0)

  const [status, setStatus] = useState("Listening for breakouts…")
  const [now, setNow] = useState(new Date())

  // ==========================
  // DATE/TIME TICK
  // ==========================
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ==========================
  // TOGGLE
  // ==========================
  const toggleEnabled = () => {
    setEnabled(!enabled)
    setStatus(!enabled ? "Listening for breakouts…" : "Assistant disabled")
  }

  // ==========================
  // ANIMATED MARGIN TRANSITION
  // ==========================
  useEffect(() => {
    const oldVal = prevMargin.current
    const newVal = requiredMargin

    if (oldVal !== newVal) {
      // Flash color
      setFlashColor(newVal > oldVal ? "flash-red" : "flash-green")

      // Remove flash after animation
      setTimeout(() => setFlashColor(""), 300)

      // Tween animation
      const duration = 300
      const start = performance.now()

const animate = (time: number) => {
  const progress = Math.min((time - start) / duration, 1)
  const eased = progress * (2 - progress) // ease-out
  setDisplayMargin(oldVal + (newVal - oldVal) * eased)
  if (progress < 1) requestAnimationFrame(animate)
}


      requestAnimationFrame(animate)
      prevMargin.current = newVal
    }
  }, [requiredMargin])

  // =========================
  // PAIR-SPECIFIC CUSHION LOGIC
  // =========================
  const getCushion = (ticker: string) => {
    const t = ticker.toUpperCase()

    if (t.includes("EURUSD")) return 0.00010
    if (t.includes("GBPUSD")) return 0.00010
    if (t.includes("AUDUSD")) return 0.00010
    if (t.includes("NZDUSD")) return 0.00010
    if (t.includes("USDCAD")) return 0.00010

    if (t.includes("JPY")) return 0.010

    if (t.includes("XAU")) return 0.50
    if (t.includes("XAG")) return 0.05

    if (t.includes("BTC")) return 5.0
    if (t.includes("ETH")) return 1.0

    return 0.00010
  }

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

        {/* ==========================
            DATE + TIME (2-CELL GRID)
           ========================== */}
        <div className="grid grid-cols-2 gap-2 text-center">

          {/* DATE */}
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold text-slate-400 tracking-wide">
              {now.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
              })}
            </span>
          </div>

          {/* TIME */}
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold text-slate-400 tracking-wide">
              {now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
              })}
            </span>
          </div>

        </div>

        {/* ==========================
            HEADER
           ========================== */}
        <div
          className={`
            w-full rounded-lg bg-[#0f0f17] border border-slate-700/40 p-3
            flex items-center justify-between
            transition-all
            ${enabled ? "shadow-[0_0_8px_rgba(0,255,180,0.25)]" : ""}
          `}
        >
          <h3 className="text-xs bold text-slate-400 tracking-wide">
            AI VOICE ASSISTANT
          </h3>

          {/* iOS Toggle */}
          <div
            onClick={toggleEnabled}
            className={`
              w-11 h-6 flex items-center rounded-full cursor-pointer transition-all
              ${enabled ? "bg-emerald-500 shadow-[0_0_6px_rgba(0,255,180,0.45)]" : "bg-slate-700"}
            `}
          >
            <div
              className={`
                w-5 h-5 bg-white rounded-full shadow transform transition-all
                ${enabled ? "translate-x-5" : "translate-x-1"}
              `}
            />
          </div>
        </div>

        {/* ==========================
            STATUS (GLOW WHEN ENABLED)
           ========================== */}
        <div className="rounded-lg bg-[#0f0f17] border border-slate-700/40 p-3">
          <p
            className={`
              text-sm tracking-wide transition-all
              ${enabled
                ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
                : "text-slate-500"
              }
            `}
          >
            {status}
          </p>
        </div>

        {/* ==========================
            RISK SLIDER
           ========================== */}
        <div className="rounded-lg bg-[#0f0f17] border border-slate-700/40 p-4">
          <GTSlider
            title="Dollar Risk Per Trade"
            value={riskAmount}
            min={1}
            max={1000}
            step={1}
            onChange={setRiskAmount}
            dollars
          />
        </div>

        {/* ==========================
            LEVERAGE SLIDER
           ========================== */}
        <div className="rounded-lg bg-[#0f0f17] border border-slate-700/40 p-4">
          <GTSlider
            title="Set your Leverage"
            value={leverage}
            min={1}
            max={50}
            step={1}
            onChange={setLeverage}
          />
        </div>

        {/* ==========================
            REQUIRED MARGIN (BIG SLATE CELL + FLASH)
           ========================== */}
        <div
          className={`
            flex justify-between items-center p-3 rounded-lg
            border border-slate-700/40 bg-black/20
            transition-all duration-300
            ${flashColor === "flash-green" ? "bg-emerald-900/40" : ""}
            ${flashColor === "flash-red" ? "bg-red-900/40" : ""}
          `}
        >
          <span className="text-slate-400">Required Margin:</span>
          <span className="text-xl font-semibold text-slate-50 tabular-nums">
            ${displayMargin.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  )
}
