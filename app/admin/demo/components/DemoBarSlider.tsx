"use client"

import { useEffect, useRef } from "react"
import { useDemoState } from "../demoState"

export default function DemoBarSlider() {
  const {
    bar,
    setActiveBar,
    updateBarEntry
  } = useDemoState()

  const isETH = bar.active === "ETH"

  const min = isETH ? 1500 : 1.14176
  const max = isETH ? 1800 : 1.18012
  const step = isETH ? 0.1 : 0.00001
  const value = isETH ? bar.ethEntry : bar.eurEntry

  const lastZone = useRef<"long" | "short" | "neutral">("neutral")

  const detectZone = (price: number) => {
    if (isETH) {
      if (price > 1700) return "long"
      if (price < 1600) return "short"
      return "neutral"
    } else {
      if (price > 1.1700) return "long"
      if (price < 1.1500) return "short"
      return "neutral"
    }
  }

  const handleChange = (v: number) => {
    updateBarEntry(v)
    lastZone.current = detectZone(v)
  }

  useEffect(() => {
    lastZone.current = "neutral"
  }, [bar.active])

  return (
    <div className="flex w-full h-[90px] items-center gap-4">

{/* LEFT GRID CELL */}
<div className="w-[70px] h-full grid grid-rows-[auto_auto] place-items-center gap-2">

  {/* iOS Pill Toggle (GoTrade Blue vs Purple, toned down) */}
  <button
    onClick={() => setActiveBar(isETH ? "EUR" : "ETH")}
    className={`
      relative w-12 h-6 rounded-full transition-all duration-300
      ${isETH ? "bg-blue-500/60" : "bg-purple-500/60"}
      border border-slate-700
    `}
  >
    <div
      className={`
        absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
        transform transition-all duration-300
        ${isETH ? "translate-x-6" : "translate-x-0"}
      `}
    />
  </button>

  {/* PRICE LABEL GRID CELL */}
  <div className="w-full px-2 py-1 rounded-md bg-slate-900/40 border border-slate-700 text-center">
    <span className="text-slate-400 text-[14px] font-medium">
      {isETH
        ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `$${value.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}`
      }
    </span>
  </div>

</div>


      {/* RIGHT: SLIDER CARD */}
      <div className="flex-1 h-full rounded-xl border border-emerald-500/20 px-4 py-3 bg-[#050509] flex items-center">

        {/* PERFECT DJ SLIDER (unchanged) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="mixer-fader-glow w-full"
          style={{
            "--fill": `${((value - min) / (max - min)) * 100}%`,
            height: "40px"
          } as any}
        />

      </div>
    </div>
  )
}
