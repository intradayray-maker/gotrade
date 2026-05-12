export default function SummaryCards({
  equity,
  hwm,
  realizedPnl,
  totalFees,
}: {
  equity: number;
  hwm: number;
  realizedPnl: number;
  totalFees: number;
}) {
  const items = [
    { label: "Equity", value: `$${equity.toFixed(2)}` },
    { label: "High Water Mark", value: `$${hwm.toFixed(2)}` },
    { label: "Realized PnL", value: `$${realizedPnl.toFixed(2)}` },
    { label: "Total Fees Paid", value: `$${totalFees.toFixed(2)}` },
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
