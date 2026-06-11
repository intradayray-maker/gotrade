// app/admin/demo/cards/DemoETHAiCard.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import GTSlider from "@/app/components/ui/GTSlider"
import GTCard from "@/components/ui/GTCard"



import { getVoiceClip } from "app/dashboard/products/TOOLS/Ai_LocalVoice"
import { useDemoState } from "../demoState"

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Trade = {
  type?: string
  ticker: string
  side: string
  entry: number
  stop: number
  tp: number
  timestamp?: string
}

const isTradeOngoing = (trade: Trade | null) =>
  trade?.type === "entry_long" || trade?.type === "entry_short"

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function DemoETHAiCard() {
  const { bar } = useDemoState()

  const [enabled, setEnabled] = useState(true)

  const [riskAmount, setRiskAmount] = useState(50)
  const [leverage, setLeverage] = useState(5)

  const [requiredMargin, setRequiredMargin] = useState(0)
  const [displayMargin, setDisplayMargin] = useState(0)

  const [latestTradeState, setLatestTradeState] = useState<Trade | null>(null)

  const prevMargin = useRef(0)
  const [flashColor, setFlashColor] = useState("")

  const [status, setStatus] = useState("Listening for breakouts…")

  // ------------------------------------------------------------
  // LIVE CLOCK (browser timezone)
  // ------------------------------------------------------------
  const [now, setNow] = useState("")

  useEffect(() => {
    const tick = () => {
      const local = new Date()
      setNow(local.toISOString())
    }

    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])



  const formatMoney = (n: number) =>
    Math.round(n).toLocaleString("en-US")

  useEffect(() => {


    const savedRisk = localStorage.getItem("eth_dollar_risk_demo")
    const savedLeverage = localStorage.getItem("eth_leverage_demo")



    if (savedRisk) setRiskAmount(Number(savedRisk))
    if (savedLeverage) setLeverage(Number(savedLeverage))


  }, [])

  useEffect(() => {
    localStorage.setItem("eth_dollar_risk_demo", String(riskAmount))
    localStorage.setItem("eth_leverage_demo", String(leverage))
  }, [riskAmount, leverage])


  // ------------------------------------------------------------
  // AI VOICE LOGIC (demo: react to trade.type if you wire it later)
  // ------------------------------------------------------------
  const prevEventRef = useRef<string | null>(null)

  useEffect(() => {
    if (!latestTradeState || !enabled) return

    const eventType = latestTradeState.type
    if (!eventType) return

    if (prevEventRef.current === eventType) return
    prevEventRef.current = eventType

  }, [latestTradeState, enabled])

  // ------------------------------------------------------------
  // MARGIN CALCULATION (using demo bar slider)
  // ------------------------------------------------------------
  useEffect(() => {
    // choose entry/stop based on active ticker
    const entry =
      bar.active === "ETH" ? bar.ethEntry : bar.eurEntry
    const stop =
      bar.active === "ETH" ? bar.ethStop : bar.eurStop

    if (!entry || !stop) return
    if (isTradeOngoing(latestTradeState)) return

    const rd = Math.abs(entry - stop)
    const sz = rd > 0 ? riskAmount / rd : 0
    const margin = leverage > 0 ? (sz * entry) / leverage : 0

    setRequiredMargin(margin)
    localStorage.setItem("eth_required_margin_demo", String(margin))
  }, [bar, riskAmount, leverage, latestTradeState])

  // ------------------------------------------------------------
  // MARGIN ANIMATION
  // ------------------------------------------------------------
  useEffect(() => {
    const oldVal = prevMargin.current
    const newVal = requiredMargin

    if (oldVal !== newVal) {
      setFlashColor(newVal > oldVal ? "flash-red" : "flash-green")
      setTimeout(() => setFlashColor(""), 300)

      const duration = 300
      const start = performance.now()

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1)
        const eased = progress * (2 - progress)
        setDisplayMargin(oldVal + (newVal - oldVal) * eased)
        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
      prevMargin.current = newVal
    }
  }, [requiredMargin])


  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">

      {/* DATE + TIME */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {now
              ? new Date(now).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                })
              : ""}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {now
              ? new Date(now).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit"
                })
              : ""}
          </span>
        </div>
      </div>

      {/* AI VOICE ASSISTANT TOGGLE */}
      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all
          ${enabled ? "shadow-[0_0_8px_rgba(0,255,180,0.15)]" : ""}
        `}
      >
        <h3 className="text-xs tracking-wide text-slate-400">
          AI VOICE ASSISTANT
        </h3>

        <div
          onClick={() => {
            const next = !enabled
            setEnabled(next)
            setStatus(
              next ? "Listening for breakouts…" : "Assistant disabled"
            )
          }}
          className={`
            flex h-6 w-11 cursor-pointer items-center rounded-full transition-all
            ${
              enabled
                ? "bg-[#0A4B78] shadow-[0_0_6px_rgba(0,255,180,0.35)]"
                : "bg-slate-700"
            }
          `}
        >
          <div
            className={`
              h-5 w-5 rounded-full bg-white shadow transition-all
              ${enabled ? "translate-x-5" : "translate-x-1"}
            `}
          />
        </div>
      </div>

      {/* STATUS */}
      <div className="rounded-xl border border-emerald-500/20 p-3">
        <p
          className={`
            text-sm tracking-wide transition-all
            ${
              enabled
                ? "text-[rgb(0,166,116)] drop-shadow-[0_0_4px_rgba(0,255,180,0.25)]"
                : "text-slate-500"
            }
          `}
        >
          {status}
        </p>
      </div>

      {/* RISK SLIDER */}
      <div className="rounded-xl border border-emerald-500/20 p-4">
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

      {/* LEVERAGE SLIDER */}
      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Set your Leverage"
          value={leverage}
          min={1}
          max={50}
          step={1}
          onChange={setLeverage}
        />
      </div>

      {/* REQUIRED MARGIN */}
      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all duration-300
          ${flashColor === "flash-green" ? "bg-emerald-950/30" : ""}
          ${flashColor === "flash-red" ? "bg-red-950/30" : ""}
        `}
      >
        <span className="text-slate-400">
          Required Margin:
        </span>
        <span className="text-xl font-semibold text-slate-50 tabular-nums">
          ${formatMoney(displayMargin)}
        </span>
      </div>
    </GTCard>
  )
}
