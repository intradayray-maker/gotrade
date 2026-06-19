// components/dashboard/LivePnlCard.tsx
'use client';

import React from 'react';
import { useLivePnl } from '@/hooks/useLivePnl';

type Props = {
  className?: string;
};

function formatCurrency(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

function formatPct(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export const LivePnlCard: React.FC<Props> = ({ className }) => {
  const { data, error, isLoading } = useLivePnl();

  const isUp = (data?.dayPnl ?? 0) >= 0;
  const pnlColor = isUp ? 'text-emerald-500' : 'text-rose-500';
  const pnlBg = isUp ? 'bg-emerald-500/10' : 'bg-rose-500/10';
  const arrow = isUp ? '▲' : '▼';

  if (error) {
    return (
      <div
        className={`rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-400 ${className ?? ''}`}
      >
        <div className="font-medium">Live P&amp;L</div>
        <div className="mt-2 text-xs opacity-80">
          {/* TODO: Blofin-specific P&amp;L fields may be displayed here later. */}
          Failed to load P&amp;L. Check Alpaca status and API keys.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-sm backdrop-blur ${className ?? ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Live P&amp;L
            </div>
            <div className="text-[0.7rem] text-zinc-500">
              Updated {data ? new Date(data.timestamp).toLocaleTimeString() : '…'}
            </div>
          </div>
        </div>

        {isLoading && !data ? (
          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
        ) : (
          <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${pnlBg} ${pnlColor}`}>
            <span>{arrow}</span>
            <span>{formatCurrency(data?.dayPnl ?? 0)}</span>
            <span className="text-[0.7rem] opacity-80">
              {formatPct(data?.dayPnlPct ?? 0)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div className="text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500">
            Equity
          </div>
          {isLoading && !data ? (
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          ) : (
            <div className="font-medium text-zinc-100">
              {formatCurrency(data?.equity ?? 0)}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500">
            Portfolio
          </div>
          {isLoading && !data ? (
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          ) : (
            <div className="font-medium text-zinc-100">
              {formatCurrency(data?.portfolioValue ?? 0)}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500">
            Cash
          </div>
          {isLoading && !data ? (
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
          ) : (
            <div className="font-medium text-zinc-100">
              {formatCurrency(data?.cash ?? 0)}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500">
            Buying Power
          </div>
          {isLoading && !data ? (
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          ) : (
            <div className="font-medium text-zinc-100">
              {formatCurrency(data?.buyingPower ?? 0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
