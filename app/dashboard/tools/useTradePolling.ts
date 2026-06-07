// app/dashboard/tools/useTradePolling.ts

"use client";

import { useEffect } from "react";
import { useTradeStore } from "./useTradeStore";

export function useTradePolling() {
  const setFromApi = useTradeStore((s) => s.setFromApi);

  useEffect(() => {
    let active = true;

    const fetchTrade = async () => {
      try {
        const res = await fetch("/api/trade", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;
        const json = await res.json();
        if (!active) return;

        const trade = json.trade ?? null;
        const bar = json.bar ?? null;
        const version = typeof json.version === "number" ? json.version : 0;

        setFromApi({ trade, bar, version });
      } catch (err) {
        console.error("Polling /api/trade failed:", err);
      }
    };

    fetchTrade();
    const interval = setInterval(fetchTrade, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [setFromApi]);
}
