export default function BestWorstTrades({
  best,
  worst,
}: {
  best: any;
  worst: any;
}) {
  const format = (t: any) =>
    t
      ? {
          symbol: t.symbol,
          pnl: t.pnl.toFixed(2),
          price: t.filled_avg_price?.toFixed(2),
          qty: t.filled_qty,
          time: new Date(t.created_at).toLocaleString(),
        }
      : null;

  const bestTrade = format(best);
  const worstTrade = format(worst);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="rounded-xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
        <p className="text-sm text-white/60">Best Trade</p>
        {bestTrade ? (
          <div className="mt-2">
            <p className="text-lg font-semibold text-green-400">
              +${bestTrade.pnl}
            </p>
            <p className="text-sm text-white/70">{bestTrade.symbol}</p>
            <p className="text-xs text-white/50 mt-1">{bestTrade.time}</p>
          </div>
        ) : (
          <p className="text-white/40 mt-2">No trades yet</p>
        )}
      </div>

      <div className="rounded-xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
        <p className="text-sm text-white/60">Worst Trade</p>
        {worstTrade ? (
          <div className="mt-2">
            <p className="text-lg font-semibold text-red-400">
              ${worstTrade.pnl}
            </p>
            <p className="text-sm text-white/70">{worstTrade.symbol}</p>
            <p className="text-xs text-white/50 mt-1">{worstTrade.time}</p>
          </div>
        ) : (
          <p className="text-white/40 mt-2">No trades yet</p>
        )}
      </div>
    </div>
  );
}
