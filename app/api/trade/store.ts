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

export const setLatestTrade = (trade: TradeData) => {
  latestTrade = trade;
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

export const setLatestBar = (bar: BarData) => {
  latestBar = bar;
};
