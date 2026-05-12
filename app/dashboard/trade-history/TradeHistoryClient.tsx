"use client";

import { useEffect, useState } from "react";
import TradeHistoryFilters, {
  TradeFiltersState,
} from "./TradeHistoryFilters";
import TradeHistoryTable, { Trade } from "./TradeHistoryTable";
import TradeHistoryPagination from "./TradeHistoryPagination";

type ApiResponse = {
  data: Trade[];
  page: number;
  totalPages: number;
};

const DEFAULT_LIMIT = 20;

export default function TradeHistoryClient() {
  const [filters, setFilters] = useState<TradeFiltersState>({
    preset: "7D",
    customStart: null,
    customEnd: null,
    symbol: "",
    side: "all",
  });
  const [page, setPage] = useState(1);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function buildQueryParams() {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(DEFAULT_LIMIT));

    if (filters.symbol.trim()) {
      params.set("symbol", filters.symbol.trim().toUpperCase());
    }

    if (filters.side !== "all") {
      params.set("side", filters.side);
    }

    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (filters.preset === "7D") {
      end = now;
      start = new Date();
      start.setDate(now.getDate() - 7);
    } else if (filters.preset === "30D") {
      end = now;
      start = new Date();
      start.setDate(now.getDate() - 30);
    } else if (filters.preset === "YTD") {
      end = now;
      start = new Date(now.getFullYear(), 0, 1);
    } else if (filters.preset === "custom") {
      if (filters.customStart) start = new Date(filters.customStart);
      if (filters.customEnd) end = new Date(filters.customEnd);
    }

    if (start) {
      params.set("start", start.toISOString());
    }
    if (end) {
      params.set("end", end.toISOString());
    }

    return params.toString();
  }

  async function fetchTrades() {
    setLoading(true);
    setError(null);

    try {
      const query = buildQueryParams();
      const res = await fetch(`/api/trades/list?${query}`);
      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await res.json()) as ApiResponse & { error?: string })
        : ({
            data: [],
            page: 1,
            totalPages: 1,
            error: await res.text(),
          } as ApiResponse & { error?: string });

      if (!res.ok) {
        setError(data.error || "Failed to load trades");
        setTrades([]);
        setTotalPages(1);
        return;
      }

      setTrades(data.data);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Unexpected error loading trades");
      setTrades([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  function handleApplyFilters(nextFilters: TradeFiltersState) {
    setPage(1);
    setFilters(nextFilters);
  }

  function handleResetFilters() {
    setPage(1);
    setFilters({
      preset: "7D",
      customStart: null,
      customEnd: null,
      symbol: "",
      side: "all",
    });
  }

  return (
    <div className="space-y-4">
      <TradeHistoryFilters
        value={filters}
        onChange={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <div className="rounded-xl border border-white/10 bg-black/40 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-white/60">
            Loading trades...
          </div>
        ) : error ? (
          <div className="flex h-40 items-center justify-center text-sm text-red-400">
            {error}
          </div>
        ) : trades.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-white/60">
            No trades found for the selected filters.
          </div>
        ) : (
          <TradeHistoryTable trades={trades} />
        )}
      </div>

      <TradeHistoryPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
