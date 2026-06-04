// hooks/useBrokerStatus.ts
import useSWR from 'swr';
import { getBrokerApiBase } from '@/lib/brokers/getBrokerApiBase';

export type BrokerStatus = {
  status: string;
  tradeBlocked: boolean;
  accountBlocked: boolean;
  buyingPower: number;
  equity: number;
  cash: number;
  patternDayTrader: boolean;
  timestamp: string;
};

const fetcher = async (url: string): Promise<BrokerStatus> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch broker status');
  return res.json();
};

export function useBrokerStatus() {
  const base = getBrokerApiBase();
  const { data, error, isLoading, mutate } = useSWR<BrokerStatus>(
    `${base}/status`,
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
