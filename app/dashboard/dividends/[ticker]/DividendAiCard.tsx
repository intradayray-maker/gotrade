export default function DividendAiCard({ ticker }: { ticker: string }) {
  return (
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
  )
}
