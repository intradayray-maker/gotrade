"use client"

import type { TickerData } from "@/lib/data-providers/types"

type AnalysisPanelProps = {
  ticker: string
  data: TickerData
}

export default function AnalysisPanel({ ticker, data }: AnalysisPanelProps) {
  return (
    <div className="flex flex-col gap-8">

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="text-xl font-bold mb-2">
          AI Summary
        </div>

        <div className="opacity-80 leading-relaxed">
          {ticker}, eh? A steady payer with a long memory.
          Sit down, lad... let me tell you what this one whispers
          when the market goes quiet.
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="text-xl font-bold mb-4">
          Key Metrics
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            Dividend Yield:{" "}
            {data.dividendYield
              ? (data.dividendYield * 100).toFixed(2)
              : "—"}%
          </div>

          <div>
            Payout Ratio: {data.payoutRatio ?? "—"}
          </div>

          <div>
            Beta: {data.beta ?? "—"}
          </div>

          <div>
            Sector: {data.sector ?? "—"}
          </div>

          <div>
            Ex‑Div Date: {data.exDividendDate ?? "—"}
          </div>

          <div>
            Safety Score: {data.safetyScore ?? "—"}
          </div>

        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="text-xl font-bold mb-2">
          Income Projection
        </div>

        <div className="opacity-70">
          A 12‑month dividend income projection for {ticker} will appear here.
        </div>
      </div>

    </div>
  )
}
