'use client';

import { useLivePositions } from '@/hooks/useLivePositions';

export default function LivePositionsCard() {
  const { data, error, isLoading } = useLivePositions();

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-400">
        <div className="font-medium">Live Positions</div>
        <div className="mt-2 text-xs opacity-80">
          {/* TODO: Blofin-specific position fields may be displayed here later. */}
          Failed to load positions. Check Alpaca status.
        </div>
      </div>
    );
  }

  const positions = data?.positions ?? [];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Open Positions</h2>
        <span className="text-xs text-slate-500">
          {data ? new Date(data.timestamp).toLocaleTimeString() : '…'}
        </span>
      </div>

      {isLoading && positions.length === 0 && (
        <div className="text-slate-500 text-sm">Loading positions…</div>
      )}

      {positions.length === 0 && !isLoading && (
        <div className="text-slate-500 text-sm">No open positions</div>
      )}

      {positions.length > 0 && (
        <div className="space-y-3">
          {positions.map((pos) => {
            const isUp = pos.unrealizedPnl >= 0;
            const color = isUp ? 'text-emerald-400' : 'text-rose-400';

            return (
              <div
                key={pos.symbol}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#11111a] p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {pos.symbol}
                  </div>
                  <div className="text-xs text-slate-500">
                    {pos.qty} @ ${pos.avgEntry.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-200">
                    ${pos.marketPrice.toFixed(2)}
                  </div>
                  <div className={`text-xs ${color}`}>
                    {isUp ? '▲' : '▼'} ${pos.unrealizedPnl.toFixed(2)} (
                    {pos.unrealizedPnlPct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
