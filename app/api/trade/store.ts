// app/api/trade/store.ts

export type TradeData = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp: string;
};

export type BarData = {
  high: number;
  low: number;
  updated_at: string;
};

export let latestTrade: TradeData | null = null;
export let latestBar: BarData | null = null;

export function setLatestTrade(trade: TradeData) {
  latestTrade = trade;
}

export function setLatestBar(bar: BarData) {
  latestBar = bar;
}
