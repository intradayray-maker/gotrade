// hooks/useLivePositions.ts
import useSWR from 'swr';
import { getBrokerApiBase } from '@/lib/brokers/getBrokerApiBase';

export type LivePosition = {
  symbol: string;
  qty: number;
  avgEntry: number;
  marketPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
};

export type LivePositionsResponse = {
  positions: LivePosition[];
  timestamp: string;
};

const fetcher = async (url: string): Promise<LivePositionsResponse> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch positions');
  return res.json();
};

export function useLivePositions() {
  const base = getBrokerApiBase();
  const { data, error, isLoading, mutate } = useSWR<LivePositionsResponse>(
    `${base}/positions`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}
