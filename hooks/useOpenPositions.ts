import { useEffect, useState } from "react";

export type OpenPosition = {
  symbol: string;
  side: "long" | "short" | "flat";
  qty: number;
};

export function useOpenPositions() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/positions/live");
        const json = await res.json();
        setPositions(json.positions ?? []);
      } catch (e) {
        console.error("Open positions fetch failed:", e);
      }
    }

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  return positions;
}
