export default function MasterSummaryCards({
  totalPnl,
  winRate,
  avgReturn,
  totalTrades,
}: {
  totalPnl: number;
  winRate: number;
  avgReturn: number;
  totalTrades: number;
}) {
  const items = [
    { label: "Total PnL", value: `$${totalPnl.toFixed(2)}` },
    { label: "Win Rate", value: `${winRate.toFixed(1)}%` },
    { label: "Avg Return", value: `${avgReturn.toFixed(2)}%` },
    { label: "Total Trades", value: totalTrades },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl p-5 bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <p className="text-sm text-white/60">{item.label}</p>
          <p className="text-xl font-semibold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
