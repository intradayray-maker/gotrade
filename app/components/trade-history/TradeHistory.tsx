interface TradeHistoryProps {}

export default function TradeHistory({}: TradeHistoryProps) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Trade History</h2>
      <p className="text-muted-foreground">Review your past trading transactions</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Symbol</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-muted-foreground">No trades yet</td>
              <td className="p-2"></td>
              <td className="p-2"></td>
              <td className="p-2"></td>
              <td className="p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}