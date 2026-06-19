export default function DividendProjectionCard({ ticker }: { ticker: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="text-xl font-bold mb-2">
        Income Projection
      </div>

      <div className="opacity-70">
        A 12‑month dividend income projection for {ticker} will appear here.
      </div>
    </div>
  )
}
