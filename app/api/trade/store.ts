// app/api/trade/store.ts

export type TradeData = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp: string;

  news_today: boolean;
  news_message: string;
  next_news_time: string;

  news_window_active: boolean;
  news_countdown: number;
};

export let latestTrade: TradeData | null = null;

// ⭐ Freeze trade object so repeated identical payloads do not cause unnecessary
// React re-renders in clients that consume /api/trade.
export const setLatestTrade = (trade: TradeData) => {
  latestTrade = Object.freeze(trade);
};

export type BarData = {
  high: number;
  low: number;
  updated_at: string;

  news_today: boolean;
  news_message: string;
  next_news_time: string;

  news_window_active: boolean;
  news_countdown: number;
};

export let latestBar: BarData | null = null;

// ⭐ Freeze bar object too (prevents unnecessary re-renders)
export const setLatestBar = (bar: BarData) => {
  latestBar = Object.freeze(bar);
};
