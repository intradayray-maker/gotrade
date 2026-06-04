// hooks/useFollowerStatus.ts
import { useEffect } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase/client';

export type FollowerStatus = {
  userId: string;
  first_name: string | null;
  last_name: string | null;
  connected: boolean;          // ⭐ REQUIRED
  allocation: number;
  synced: boolean;
  disabled: boolean;
  error: boolean;
  lastTrade: string | null;
  lastActivity: string | null;
  pendingQueue: number;
};


export type FollowerStatusResponse = {
  followers: FollowerStatus[];
  timestamp: string;
};

const fetcher = async (url: string): Promise<FollowerStatusResponse> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch follower status');
  return res.json();
};

export function useFollowerStatus() {
  const { data, error, isLoading, mutate } = useSWR<FollowerStatusResponse>(
    '/api/followers/status',
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {
    const channel = supabase
      .channel('follower-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'copy_trading_settings',
        },
        () => mutate()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_queue',
        },
        () => mutate()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_errors',
        },
        () => mutate()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_logs',
        },
        () => mutate()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broker_connections',
        },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}
