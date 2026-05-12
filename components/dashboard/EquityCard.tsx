"use client";

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
    <div>
      <div>{data.equity}</div>
      <div>{data.updated_at}</div>
    </div>
  );
}
