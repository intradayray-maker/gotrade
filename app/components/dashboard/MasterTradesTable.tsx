export default function MasterTradesTable({ trades }: { trades: any[] }) {
  return (
    <div className="rounded-xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 mt-6">
      <h2 className="text-lg font-semibold mb-4">Master Trades</h2>

      <table className="w-full text-sm">
        <thead className="text-white/60 border-b border-white/10">
          <tr>
            <th className="py-2 text-left">Symbol</th>
            <th className="py-2 text-left">Side</th>
            <th className="py-2 text-left">Price</th>
            <th className="py-2 text-left">Qty</th>
            <th className="py-2 text-left">PnL</th>
            <th className="py-2 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => (
            <tr key={t.id} className="border-b border-white/5">
              <td className="py-2">{t.symbol}</td>
              <td className="py-2 capitalize">{t.side}</td>
              <td className="py-2">${Number(t.filled_avg_price).toFixed(2)}</td>
              <td className="py-2">{t.filled_qty}</td>
              <td className="py-2">${t.pnl.toFixed(2)}</td>
              <td className="py-2">
                {new Date(t.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
