"use client";

import { useEffect, useState } from "react";

type Position = {
  symbol: string;
  qty: number;
  avg_price: number | null;
};

export default function PositionsTable() {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/dashboard/positions", {
        cache: "no-store",
      });
      const data = (await response.json()) as { positions?: Position[] };
      setPositions(data.positions ?? []);
    }

    void load();
  }, []);

  return (
    <table>
      <tbody>
        {positions.map((position) => (
          <tr key={position.symbol}>
            <td>{position.symbol}</td>
            <td>{position.qty}</td>
            <td>{position.avg_price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
