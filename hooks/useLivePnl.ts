import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLivePnl() {
  const { data, error, isLoading, mutate } = useSWR("/api/pnl/live", fetcher, {
    refreshInterval: 1000,
  });

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}
