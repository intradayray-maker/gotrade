const trades = [
  {
    symbol: 'AAPL',
    side: 'Long',
    qty: 10,
    entry: 182.4,
    exit: 188.1,
    pnl: 57.0,
  },
  {
    symbol: 'TSLA',
    side: 'Short',
    qty: 5,
    entry: 210.2,
    exit: 202.8,
    pnl: 37.0,
  },
  {
    symbol: 'NVDA',
    side: 'Long',
    qty: 3,
    entry: 820.5,
    exit: 799.2,
    pnl: -63.9,
  },
];

export default function RecentTradesTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 bg-[#050509] text-sm">
        <thead className="bg-[#020617]">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Symbol
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Side
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
              Qty
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
              Entry
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
              Exit
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
              P&L
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {trades.map((t, i) => (
            <tr key={i} className="hover:bg-slate-900/40">
              <td className="px-3 py-2 text-xs font-medium text-slate-100">
                {t.symbol}
              </td>
              <td className="px-3 py-2 text-xs text-slate-300">
                {t.side}
              </td>
              <td className="px-3 py-2 text-right text-xs text-slate-300">
                {t.qty}
              </td>
              <td className="px-3 py-2 text-right text-xs text-slate-300">
                ${t.entry.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right text-xs text-slate-300">
                ${t.exit.toFixed(2)}
              </td>
              <td
                className={
                  'px-3 py-2 text-right text-xs ' +
                  (t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400')
                }
              >
                {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
