export default function TradeHistoryTable() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 font-medium text-white/70">Date</th>
              <th className="text-left px-4 py-3 font-medium text-white/70">Symbol</th>
              <th className="text-left px-4 py-3 font-medium text-white/70">Type</th>
              <th className="text-left px-4 py-3 font-medium text-white/70">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-white/70">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-white/5 transition">
              <td className="px-4 py-4 text-white/40">No trades found</td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
