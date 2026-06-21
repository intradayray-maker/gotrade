"use client"

import { useEffect, useRef, useState } from "react"
import GTCard from "@/components/ui/GTCard"
import { useDemoState } from "../demoState"

// ------------------------------------------------------------
// AI PULSE STYLES (same as real card)
// ------------------------------------------------------------
const pulseStyles = `
@keyframes pulse-blue {
  0% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
  50% { box-shadow: 0 0 18px rgba(0,150,255,0.55); }
  100% { box-shadow: 0 0 0px rgba(0,150,255,0.25); }
}

@keyframes pulse-orange {
  0% { box-shadow: 0 0 0px rgba(255,140,0,0.25); }
  50% { box-shadow: 0 0 18px rgba(255,140,0,0.55); }
  100% { box-shadow: 0 0 0px rgba(255,140,0,0.25); }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
  50% { box-shadow: 0 0 18px rgba(255,0,0,0.55); }
  100% { box-shadow: 0 0 0px rgba(255,0,0,0.25); }
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0px rgba(0,255,180,0.25); }
  50% { box-shadow: 0 0 18px rgba(0,255,180,0.55); }
  100% { box-shadow: 0 0 0px rgba(0,255,180,0.25); }
}

.ai-pulse-blue { animation: pulse-blue 3.2s ease-in-out infinite; border-color: rgba(0,150,255,0.45) !important; }
.ai-pulse-orange { animation: pulse-orange 3.2s ease-in-out infinite; border-color: rgba(255,140,0,0.45) !important; }
.ai-pulse-red { animation: pulse-red 3.2s ease-in-out infinite; border-color: rgba(255,0,0,0.45) !important; }
.ai-pulse-green { animation: pulse-green 3.2s ease-in-out infinite; border-color: rgba(0,255,180,0.45) !important; }
`

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style")
  styleTag.innerHTML = pulseStyles
  document.head.appendChild(styleTag)
}

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Derived = {
  units: number
  position_value: number
  required_margin: number
}

// ------------------------------------------------------------
// DEMO TRADE OUTPUT CARD
// ------------------------------------------------------------
export default function DemoETHTradeOutputCard() {

  // ⭐ PATCH 1 — include tradeVersion
  const { bar, trade, tradeVersion } = useDemoState()

  // derived values
  const [derived, setDerived] = useState<Derived>({
    units: 0,
    position_value: 0,
    required_margin: 0
  })

  // animated versions
  const [animTrade, setAnimTrade] = useState({
    ticker: "ETHUSDT",
    side: "",
    entry: 0,
    stop: 0,
    tp: 0,
    type: ""
  })

  const [animDerived, setAnimDerived] = useState(derived)

  const prevTrade = useRef(animTrade)
  const prevDerived = useRef(derived)

  const [flash, setFlash] = useState("")

  // leverage + margin from Ai card (demo keys)
  const [leverage, setLeverage] = useState(1)
  const [marginFromAi, setMarginFromAi] = useState(0)

  // ------------------------------------------------------------
  // ⭐ PATCHED FORMATTERS (ETH=2, EUR=5)
  // ------------------------------------------------------------
  const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US")

  const fmtPrice = (n: number, decimals = 2) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })

    // ------------------------------------------------------------
    // DECIMAL LOGIC (ETH = 2, EUR = 5)
    // ------------------------------------------------------------
   const isETH = animTrade.ticker === "ETHUSDT"
   const decimals = isETH ? 2 : 5

  // ------------------------------------------------------------
  // COPY BUTTON
  // ------------------------------------------------------------
  const CopyBtn = ({ val }: { val: number }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(String(val))
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }

    return (
      <button
        onClick={handleCopy}
        className={`
          relative ml-2 rounded-md px-2 py-1 text-xs font-medium transition-all
          ${
            copied
              ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(0,255,0,0.45)] scale-105"
              : "text-slate-300 bg-slate-700/40 hover:bg-slate-600/40 hover:text-white"
          }
        `}
      >
        {copied ? "✓ Copied!" : "Copy"}
        {copied && (
          <span className="absolute inset-0 rounded-md bg-emerald-400/20 animate-ping"></span>
        )}
      </button>
    )
  }

 // ------------------------------------------------------------
// LOAD LEVERAGE + MARGIN FROM DEMO AI CARD
// ------------------------------------------------------------
useEffect(() => {
  const lev = localStorage.getItem("eth_leverage_demo")
  const m = localStorage.getItem("eth_required_margin_demo")

  if (lev) setLeverage(parseFloat(lev))
  if (m) setMarginFromAi(parseFloat(m))
}, [])

useEffect(() => {
  const interval = setInterval(() => {
    const lev = localStorage.getItem("eth_leverage_demo")
    const m = localStorage.getItem("eth_required_margin_demo")

    if (lev) setLeverage(parseFloat(lev))
    if (m) setMarginFromAi(parseFloat(m))
  }, 1000)

  return () => clearInterval(interval)
}, [])

// ------------------------------------------------------------
// BUILD TRADE FROM BAR SLIDER + DIRECTOR PANEL
// ------------------------------------------------------------
const entryRaw = bar.active === "ETH" ? bar.ethEntry : bar.eurEntry
const stopRaw  = bar.active === "ETH" ? bar.ethStop  : bar.eurStop

// ⭐ PATCH — correct decimals for each asset
const entry = bar.active === "ETH"
  ? parseFloat(entryRaw.toFixed(2))
  : parseFloat(entryRaw.toFixed(5))

const stop = bar.active === "ETH"
  ? parseFloat(stopRaw.toFixed(2))
  : parseFloat(stopRaw.toFixed(5))

// TP uses same decimal precision as entry
const tp = bar.active === "ETH"
  ? parseFloat((entry + (entry - stop) * 4).toFixed(2))
  : parseFloat((entry + (entry - stop) * 4).toFixed(5))

const liveTrade = {
  ticker: bar.active === "ETH" ? "ETHUSDT" : "EURUSD",
  side: trade.side,
  entry,
  stop,
  tp,
  type: trade.type
}

// ------------------------------------------------------------
// FLAT LOGIC (TP / SL / EMPTY SIDE)
// ------------------------------------------------------------
const isFlat =
  trade.type === "tp" ||
  trade.type === "sl" ||
  trade.type === "" ||
  trade.side === ""

// ------------------------------------------------------------
// DERIVED CALCULATION
// ------------------------------------------------------------
const computeDerived = () => {
  if (isFlat || !entry || marginFromAi <= 0 || leverage <= 0) {
    return {
      units: 0,
      position_value: 0,
      required_margin: 0
    }
  }

  const units = (marginFromAi * leverage) / entry
  const positionValue = units * entry

  return {
    units,
    position_value: positionValue,
    required_margin: marginFromAi
  }
}


  // ⭐ PATCH 2 — include tradeVersion
  useEffect(() => {
    setDerived(computeDerived())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, stop, tp, marginFromAi, leverage, trade.side, trade.type, tradeVersion])

  // ------------------------------------------------------------
  // FLASH + PULSE HELPERS
  // ------------------------------------------------------------
  const getPulseClass = () => {
    switch (animTrade.type) {
      case "entry_long":
        return "ai-pulse-blue"
      case "entry_short":
        return "ai-pulse-orange"
      case "sl":
        return "ai-pulse-red"
      case "tp":
        return "ai-pulse-green"
      default:
        return ""
    }
  }

  const getFlashClass = () => {
    switch (animTrade.type) {
      case "entry_long":
        return "bg-blue-950/30"
      case "entry_short":
        return "bg-orange-950/30"
      case "sl":
        return "bg-red-950/30"
      case "tp":
        return "bg-emerald-950/30"
      default:
        return ""
    }
  }

  // ------------------------------------------------------------
  // ⭐ FIXED ANIMATION EFFECT — NO MORE INFINITE LOOP
  // ------------------------------------------------------------
  useEffect(() => {
    // FLAT OVERRIDE — runs once when TP/SL/empty
    if (isFlat) {
      setAnimTrade({
        ticker: liveTrade.ticker,
        side: "FLAT",
        entry: 0,
        stop: 0,
        tp: 0,
        type: "flat"
      })

      setAnimDerived({
        units: 0,
        position_value: 0,
        required_margin: 0
      })

      prevTrade.current = {
        ticker: liveTrade.ticker,
        side: "FLAT",
        entry: 0,
        stop: 0,
        tp: 0,
        type: "flat"
      }

      prevDerived.current = {
        units: 0,
        position_value: 0,
        required_margin: 0
      }

      return
    }

    const oldT = prevTrade.current
    const newT = liveTrade
    const oldD = prevDerived.current
    // compute derived immediately so the animation reacts instantly
    const newD = computeDerived()

    const changed =
      newT.entry !== oldT.entry ||
      newT.stop !== oldT.stop ||
      newT.tp !== oldT.tp ||
      newT.type !== oldT.type ||
      newT.side !== oldT.side

    if (!changed) return

    if (newT.type !== "bar") {
      setFlash(getFlashClass())
      setTimeout(() => setFlash(""), 300)
    }

    const duration = 300
    const start = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = progress * (2 - progress)

      setAnimTrade({
        ticker: newT.ticker,
        side: newT.side,
        entry: oldT.entry + (newT.entry - oldT.entry) * eased,
        tp: oldT.tp + (newT.tp - oldT.tp) * eased,
        stop: oldT.stop + (newT.stop - oldT.stop) * eased,
        type: newT.type
      })

      setAnimDerived({
        units: oldD.units + (newD.units - oldD.units) * eased,
        position_value:
          oldD.position_value +
          (newD.position_value - oldD.position_value) * eased,
        required_margin:
          oldD.required_margin +
          (newD.required_margin - oldD.required_margin) * eased
      })

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    prevTrade.current = newT
    prevDerived.current = newD

  }, [
    // Use only stable primitive dependencies so the array shape doesn't change
    liveTrade.ticker,
    liveTrade.side,
    liveTrade.entry,
    liveTrade.stop,
    liveTrade.tp,
    liveTrade.type,
    entry,
    stop,
    tp,
    marginFromAi,
    leverage,
    isFlat
  ])

  // ------------------------------------------------------------
  // SIDE COLOR
  // ------------------------------------------------------------
  const getSideGlow = () => {
    if (isFlat) return "text-slate-500 uppercase"
    if (animTrade.side === "long")
      return "text-[#4da3ff] drop-shadow-[0_0_6px_rgba(0,150,255,0.55)] uppercase"
    if (animTrade.side === "short")
      return "text-orange-400 drop-shadow-[0_0_6px_rgba(255,140,0,0.55)] uppercase"
    return "text-slate-500 uppercase"
  }

  const getEntryBorderGlow = () => {
    if (isFlat) return "border-slate-600/20"
    if (animTrade.side === "long")
      return "border-blue-500/40 shadow-[0_0_8px_rgba(0,150,255,0.45)]"
    if (animTrade.side === "short")
      return "border-orange-500/40 shadow-[0_0_8px_rgba(255,140,0,0.45)]"
    return "border-slate-600/20"
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <GTCard
      className={`
        flex h-full flex-col gap-4 border-2 rounded-xl transition-all
        ${isFlat ? "" : getPulseClass()}
      `}
    >
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Trade Execution Details
      </p>

      <div className="space-y-3">

        {/* POSITION */}
        <div
          className={`
            flex items-center justify-between rounded-xl border border-slate-600/20 p-3 transition-all
            ${flash}
          `}
        >
          <span className="text-slate-400">Position:</span>
          <span className={`text-xl font-semibold tabular-nums ${getSideGlow()}`}>
            {isFlat ? "FLAT" : animTrade.side || "--"}
          </span>
        </div>

        {/* TICKER */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Ticker:</span>
          <span className="text-xl font-semibold tabular-nums text-white">
            {animTrade.ticker || "--"}
          </span>
        </div>

        {/* SIZE */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">
            {bar.active === "ETH" ? "ETH Size:" : "Units:"}
          </span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {isFlat ? "--" : animDerived.units ? fmtInt(animDerived.units) : "--"}
            {!isFlat && animDerived.units > 0 && (
              <CopyBtn val={Math.round(animDerived.units)} />
            )}
          </span>
        </div>

        {/* POSITION VALUE */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Position Value:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {isFlat
              ? "--"
              : animDerived.position_value
              ? `$${fmtInt(animDerived.position_value)}`
              : "--"}
            {!isFlat && animDerived.position_value > 0 && (
              <CopyBtn val={Math.round(animDerived.position_value)} />
            )}
          </span>
        </div>

        {/* MARGIN USED */}
        <div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
          <span className="text-slate-400">Margin Used:</span>
          <span className="text-xl font-semibold tabular-nums text-white flex items-center">
            {isFlat
              ? "--"
              : animDerived.required_margin
              ? `$${fmtInt(animDerived.required_margin)}`
              : "--"}
            {!isFlat && animDerived.required_margin > 0 && (
              <CopyBtn val={Math.round(animDerived.required_margin)} />
            )}
          </span>
        </div>




 {/* ENTRY PRICE */}
<div
  className={`
    flex items-center justify-between rounded-xl p-3 transition-all
    ${getEntryBorderGlow()}
  `}
>
  <span className="text-slate-400">Entry Price:</span>
  <span className="text-xl font-semibold tabular-nums text-white flex items-center">
    {isFlat
      ? "--"
      : animTrade.entry
      ? fmtPrice(animTrade.entry, decimals)
      : "--"}
    {!isFlat && animTrade.entry > 0 && (
      <CopyBtn val={animTrade.entry} />
    )}
  </span>
</div>

{/* STOP LOSS */}
<div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
  <span className="text-slate-400">Stop Loss:</span>
  <span className="text-xl font-semibold tabular-nums text-red-400 flex items-center">
    {isFlat
      ? "--"
      : animTrade.stop
      ? fmtPrice(animTrade.stop, decimals)
      : "--"}
    {!isFlat && animTrade.stop > 0 && (
      <CopyBtn val={animTrade.stop} />
    )}
  </span>
</div>

{/* TAKE PROFIT */}
<div className="flex items-center justify-between rounded-xl border border-slate-600/20 p-3">
  <span className="text-slate-400">Take Profit:</span>
  <span className="text-xl font-semibold tabular-nums text-emerald-400 flex items-center">
    {isFlat
      ? "--"
      : animTrade.tp
      ? fmtPrice(animTrade.tp, decimals)
      : "--"}
            {!isFlat && animTrade.tp > 0 && <CopyBtn val={animTrade.tp} />}
          </span>
        </div>

      </div>
    </GTCard>
  )
}
