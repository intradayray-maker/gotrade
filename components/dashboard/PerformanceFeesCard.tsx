"use client";

import { useEffect, useState } from "react";

type Fee = {
  id: string;
  amount: number;
  created_at: string | null;
};

export default function PerformanceFeesCard() {
  const [fees, setFees] = useState<Fee[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/dashboard/fees", {
        cache: "no-store",
      });
      const data = (await response.json()) as { fees?: Fee[] };
      setFees(data.fees ?? []);
    }

    void load();
  }, []);

  return (
    <ul>
      {fees.map((fee) => (
        <li key={fee.id}>
          <span>{fee.amount}</span>
          <span>{fee.created_at}</span>
        </li>
      ))}
    </ul>
  );
}
