"use client"

import { useState } from "react"

type Trade = {
  ticker: string
  side: string
  size: number
  entry: number
  tp: number
  stop: number
}

export default function TradeOutput() {

  const [data, setData] = useState<Trade>({
    ticker: "",
    side: "",
    size: 0,
    entry: 0,
    tp: 0,
    stop: 0
  })

  // Example usage:
  // updateTrade({ ticker: "EURUSD", side: "long", size: 2.5, entry: 1.0852, tp: 1.0890, stop: 1.0830 })
  const updateTrade = (t: Trade) => setData(t)

  // ==========================
  // SIDE COLOR LOGIC
  // ==========================
  const getSideColor = () => {
    if (data.side === "long") return "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.45)]"
    if (data.side === "short") return "text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]"
    return "text-slate-500"
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
        bg-[#0f0f17]
        p-4
        h-full
        flex
        flex-col
        gap-4
        "
      >

        <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
          Trade Execution Details
        </p>

        <div className="space-y-3">

          {/* SIDE */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Side:</span>
            <span className={`text-xl font-semibold tabular-nums capitalize ${getSideColor()}`}>
              {data.side || "--"}
            </span>
          </div>

          {/* TICKER */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Ticker:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              {data.ticker || "--"}
            </span>
          </div>

          {/* SIZE */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Size:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              {data.size ? data.size.toFixed(2) : "--"}
            </span>
          </div>

          {/* ENTRY */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Entry Price:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              {data.entry || "--"}
            </span>
          </div>

          {/* TAKE PROFIT */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Take Profit:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              {data.tp || "--"}
            </span>
          </div>

          {/* STOP LOSS */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
            <span className="text-slate-400">Stop Loss:</span>
            <span className="text-xl font-semibold text-slate-50 tabular-nums">
              {data.stop || "--"}
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
