// ================================================
// FILE: app/dashboard/dividends/DividendMicroCards.tsx
// ================================================

"use client"

export default function DividendMicroCards() {
  const mock = {
    yield: 3.2,
    payout: 48,
    fcfPayout: 55,
    growth: 7.4,
    debt: 0.62,
  }

  const cards = [
    {
      label: "Dividend Yield",
      value: `${mock.yield}%`,
      color: "text-blue-400",
    },
    {
      label: "Payout Ratio",
      value: `${mock.payout}%`,
      color: "text-green-400",
    },
    {
      label: "FCF Payout",
      value: `${mock.fcfPayout}%`,
      color: "text-emerald-400",
    },
    {
      label: "5Y Growth",
      value: `${mock.growth}%`,
      color: "text-purple-400",
    },
    {
      label: "Debt / Equity",
      value: mock.debt,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">

      {cards.map((card) => (
        <div
          key={card.label}
          className="
            flex flex-col items-center justify-center
            border border-neutral-800 rounded-xl p-4
            bg-neutral-900/40 hover:bg-neutral-900
            transition
          "
        >
          <span className="text-neutral-400 text-xs tracking-wide">
            {card.label}
          </span>

          <span className={`text-xl font-bold mt-1 ${card.color}`}>
            {card.value}
          </span>
        </div>
      ))}

    </div>
  )
}
