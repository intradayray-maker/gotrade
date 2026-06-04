"use client";

import GTCard from "@/components/ui/GTCard";
import { useEffect, useState } from "react";

type EquityResponse = {
  equity: number | null;
  updated_at: string | null;
};

export default function EquityCard() {
  const [data, setData] = useState<EquityResponse>({
    equity: null,
    updated_at: null,
  });

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/dashboard/equity", {
        cache: "no-store",
      });
      const json = (await response.json()) as EquityResponse;
      setData(json);
    }

    void load();
  }, []);

  return (
    <GTCard className="!p-4">
      <div className="text-slate-100 text-lg font-semibold">
        {data.equity ?? "—"}
      </div>
      <div className="text-xs text-slate-400 mt-1">
        {data.updated_at ?? "No update yet"}
      </div>
    </GTCard>
  );
}
