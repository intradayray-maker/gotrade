export default function FeeHistoryTable({ fees }: { fees: any[] }) {
  return (
    <div className="rounded-xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 mt-6">
      <h2 className="text-lg font-semibold mb-4">Performance Fee History</h2>

      <table className="w-full text-sm">
        <thead className="text-white/60 border-b border-white/10">
          <tr>
            <th className="py-2 text-left">Period</th>
            <th className="py-2 text-left">Amount</th>
            <th className="py-2 text-left">Crystallized At</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f.id} className="border-b border-white/5">
              <td className="py-2">
                {f.period_start} → {f.period_end}
              </td>
              <td className="py-2">${Number(f.amount).toFixed(2)}</td>
              <td className="py-2">
                {new Date(f.crystallized_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
