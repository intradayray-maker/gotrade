// hooks/useEquityHistory.ts
"use client";

import useSWR from "swr";

export type EquityHistoryPoint = {
  created_at: string;
  equity: number;
};

type EquityHistoryApiPoint = {
  timestamp: number;
  equity: number;
};

type EquityHistoryResponse = {
  history: EquityHistoryApiPoint[];
};

const fetcher = async (url: string): Promise<EquityHistoryResponse> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return { history: [] };
  }

  const json = await res.json();
  return {
    history: Array.isArray(json?.history) ? json.history : [],
  };
};

export function useEquityHistory(
  period = "1Y",
  timeframe = "1D",
  benchmark = "SPY"
): { history: EquityHistoryPoint[] } {
  const params = new URLSearchParams({
    period,
    timeframe,
    benchmark,
  });

  const { data } = useSWR<EquityHistoryResponse>(
    `/api/equity/history?${params.toString()}`,
    fetcher
  );

  return {
    history:
      data?.history?.map((point) => ({
        created_at: new Date(point.timestamp).toISOString(),
        equity: Number(point.equity),
      })) ?? [],
  };
}

