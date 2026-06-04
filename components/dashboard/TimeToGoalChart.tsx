"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { CircularProgress } from "@/components/dashboard/CircularProgress";

interface TimeToGoalChartProps {
  currentBalance: number;
  expectedMonthlyReturnPct: number;
  requiredBalance: number;
  progressPct?: number; // <-- added so we can show progress ring here
}

interface Point {
  month: number;
  label: string;
  balance: number;
}

function buildProjectionData(
  currentBalance: number,
  expectedMonthlyReturnPct: number,
  requiredBalance: number
): Point[] {
  const data: Point[] = [];
  const start = Math.max(0, currentBalance || 0);
  const r = expectedMonthlyReturnPct > 0 ? expectedMonthlyReturnPct / 100 : 0;

  const maxMonths = 36;
  let balance = start;

  for (let m = 0; m <= maxMonths; m++) {
    if (m === 0) balance = start;
    else if (r > 0) balance = balance * (1 + r);

    data.push({
      month: m,
      label: m === 0 ? "0" : `${m}m`,
      balance,
    });

    if (requiredBalance > 0 && balance >= requiredBalance) break;
  }

  return data;
}

export function TimeToGoalChart({
  currentBalance,
  expectedMonthlyReturnPct,
  requiredBalance,
  progressPct = 0,
}: TimeToGoalChartProps) {
  const data = buildProjectionData(
    currentBalance,
    expectedMonthlyReturnPct,
    requiredBalance
  );

  const goal = requiredBalance > 0 ? requiredBalance : 0;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        Time-to-Goal Projection
      </p>

      {/* Progress Ring Centered */}
      <div className="flex justify-center mt-1 mb-2">
        <CircularProgress value={progressPct} label="Progress" size={130} />
      </div>

      {/* Chart */}
      <div className="h-52 w-full md:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.15)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickFormatter={(v: number) => `${v}m`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "0.75rem",
                padding: "0.5rem 0.75rem",
              }}
              labelFormatter={(label: any) => `${label} months`}
              formatter={(value: any) => [
                `$${Number(value).toFixed(0)}`,
                "Projected Balance",
              ]}
            />

            {goal > 0 && (
              <ReferenceLine
                y={goal}
                stroke="rgba(148,163,184,0.5)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}

            <Area
              type="monotone"
              dataKey="balance"
              stroke="rgba(34,197,94,0.7)"
              strokeWidth={2}
              fill="rgba(34,197,94,0.15)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
