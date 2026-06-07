// app/dashboard/tools/useTradeStore.ts

"use client";

import { create } from "zustand";

export type Trade = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp?: string;

  news_today?: boolean;
  news_message?: string;
  next_news_time?: string;

  news_window_active?: boolean;
  news_countdown?: number;
};

export type Bar = {
  high: number;
  low: number;
  updated_at: string;

  news_today: boolean;
  news_message: string;
  next_news_time: string;

  news_window_active: boolean;
  news_countdown: number;
};

export type TradeStore = {
  trade: Trade | null;
  bar: Bar | null;
  version: number;
  setFromApi: (payload: {
    trade: Trade | null;
    bar: Bar | null;
    version: number;
  }) => void;
};

export const useTradeStore = create<TradeStore>((set) => ({
  trade: null,
  bar: null,
  version: 0,
  setFromApi: ({ trade, bar, version }) =>
    set((prev) => {
      if (version === prev.version) return prev;
      return { trade, bar, version };
    }),
}));
