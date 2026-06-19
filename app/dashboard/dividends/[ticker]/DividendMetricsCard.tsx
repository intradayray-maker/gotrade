export default function DividendMetricsCard({ data }: { data: any }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="text-xl font-bold mb-4">
        Key Metrics
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>Dividend Yield: {data.dividendYield ? (data.dividendYield * 100).toFixed(2) : "—"}%</div>
        <div>Payout Ratio: {data.payoutRatio ?? "—"}</div>
        <div>Beta: {data.beta ?? "—"}</div>
        <div>Sector: {data.sector ?? "—"}</div>
        <div>Ex‑Div Date: {data.exDividendDate ?? "—"}</div>
        <div>Safety Score: {data.safetyScore ?? "—"}</div>

      </div>
    </div>
  )
}
