import TradeHistoryClient from "./TradeHistoryClient";

export default function TradeHistoryPage() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 space-y-8 max-w-5xl mx-auto">
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Trade History
        </h1>
        <p className="text-white/50 mt-1">
          Review your executed trades and transaction details.
        </p>
      </div>

      <TradeHistoryClient />
    </div>
  );
}
