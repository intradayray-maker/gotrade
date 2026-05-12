export type Trade = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  timestamp: string;
};

export default function TradeHistoryTable({ trades }: { trades: Trade[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.4)] overflow-hidden">
      <div className="overflow-x-auto px-6 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 font-medium text-white/70">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-white/70">
                Symbol
              </th>
              <th className="text-left px-4 py-3 font-medium text-white/70">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-white/70">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-white/70">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-white/5 transition">
                <td className="px-4 py-4 text-white/80">
                  {new Date(trade.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-white/80">{trade.symbol}</td>
                <td className="px-4 py-4 text-white/80 uppercase">
                  {trade.side}
                </td>
                <td className="px-4 py-4 text-white/80">
                  {trade.qty} @ ${trade.price.toFixed(2)}
                </td>
                <td className="px-4 py-4 text-emerald-400">Filled</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
