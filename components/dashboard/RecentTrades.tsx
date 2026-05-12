"use client";

import { useEffect, useState } from "react";

type Trade = {
  id: string;
  symbol: string;
  side: string;
  qty: number;
  status: string;
};

export default function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/dashboard/trades", {
        cache: "no-store",
      });
      const data = (await response.json()) as { trades?: Trade[] };
      setTrades(data.trades ?? []);
    }

    void load();
  }, []);

  return (
    <ul>
      {trades.map((trade) => (
        <li key={trade.id}>
          <span>{trade.symbol}</span>
          <span>{trade.side}</span>
          <span>{trade.qty}</span>
          <span>{trade.status}</span>
        </li>
      ))}
    </ul>
  );
}
