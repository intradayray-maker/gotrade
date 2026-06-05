// app/api/trade/store.ts

export type TradeData = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp: string;

  // NEW FIELDS FOR GOTRADE NEWS
  news_today: boolean;
  news_message: string;
  next_news_time: string;
};

export let latestTrade: TradeData | null = null;

export const setLatestTrade = (trade: TradeData) => {
  latestTrade = trade;
};

export type BarData = {
  high: number;
  low: number;
  updated_at: string;
};

export let latestBar: BarData | null = null;

export const setLatestBar = (bar: BarData) => {
  latestBar = bar;
};
