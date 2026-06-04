"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function EquityCurveChart() {
  // ⭐ Week labels
  const labels = [
    "Week 0","Week 2","Week 4","Week 6","Week 8",
    "Week 10","Week 12","Week 14","Week 16","Week 18"
  ];

  // ⭐ Real period results from your sheet
  const periodResults = [2, 12, 18, 20, -8, 5, -2, -2, 9];
  const total = 54;
  const totalReturn = 0.2634;

  // ⭐ Convert to real % returns
  const periodPercents = periodResults.map(r => (r / total) * totalReturn);

  // ⭐ Build real compounded balances
  const start = 21000;
  const balances: number[] = [start];

  periodPercents.forEach((pct, i) => {
    const next = balances[i] * (1 + pct);
    balances.push(Math.round(next));
  });

  // ⭐ EMA line
  const alpha = 0.55;
  const ema: number[] = [];

  balances.forEach((v, i) => {
    if (i === 0) ema.push(v * 0.985);
    else ema.push(ema[i - 1] + alpha * (v - ema[i - 1]));
  });

  // ⭐ Glow points + % labels plugin
  const fxPlugin = {
    id: "fxPlugin",
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;

      chart.data.datasets.forEach((dataset: any, index: number) => {
        const meta = chart.getDatasetMeta(index);

        meta.data.forEach((point: any, i: number) => {
          const value = dataset.data[i];
          if (value == null) return;

          // ⭐ Real % label
          const pct = ((value - start) / start) * 100;

          ctx.save();
          ctx.fillStyle = dataset.borderColor;
          ctx.font = "13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`${pct.toFixed(0)}%`, point.x, point.y - 18);
          ctx.restore();

          // ⭐ Glow point on milestones (main curve only)
          if (index === 0) {
            ctx.save();
            ctx.shadowColor = "rgba(255,215,0,0.85)";
            ctx.shadowBlur = 18;

            ctx.fillStyle = "rgba(255,215,0,1)";
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        });
      });
    }
  };

  // ⭐ Background glow plugin
  const gridGlowPlugin = {
    id: "gridGlow",
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.shadowColor = "rgba(0,255,180,0.15)";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;

      // bottom glow line
      ctx.beginPath();
      ctx.moveTo(chartArea.left, chartArea.bottom);
      ctx.lineTo(chartArea.right, chartArea.bottom);
      ctx.stroke();

      ctx.restore();
    }
  };

  const data = {
    labels,
    datasets: [
      // ⭐ Main Equity Curve
      {
        label: "Equity Curve",
        data: balances,
        borderColor: "rgb(3,82,65)",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.35,
        fill: true,

        // ⭐ GoTrade Gradient Fill
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(3,82,65,0.15)";

          const gradient = ctx.createLinearGradient(
            0, chartArea.bottom, 0, chartArea.top
          );

          gradient.addColorStop(0, "rgba(3,82,65,0.10)");
          gradient.addColorStop(0.5, "rgba(113,97,20,0.22)");
          gradient.addColorStop(1, "rgba(84,33,33,0.35)");

          return gradient;
        }
      },

      // ⭐ EMA Line
      {
        label: "Weekly EMA",
        data: ema,
        borderColor: "rgb(113,97,20)",
        borderWidth: 3,
        pointRadius: 8,
        tension: .35,
        fill: true,
        borderShadowColor: "rgba(255,215,0,0.55)",
        borderShadowBlur: 18
      }
    ]
  };

  // ⭐ Chart Options
  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: {
      duration: 1800,
      easing: "easeOutQuart"
    },
    layout: {
      padding: {
        left: 28,
        right: 12,
        top: 12,
        bottom: 12
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => "$" + Number(ctx.raw).toLocaleString()
        }
      }
    },
    scales: {
      y: {
  ticks: {
    callback: (v) => "$" + Number(v).toLocaleString(),
    color: "rgba(50,160,90,0.85)",
    font: { size: 14 },
    padding: 12   // ⭐ axis font padding
  },
  grid: {display: true,
          color: (ctx) => {
            const alpha = 0.04 + (ctx.index % 2) * 0.02;
            return `rgba(255,255,255,${alpha})`;
          },
          lineWidth: 1.1,
          drawTicks: false
        }
      },
      x: {
  ticks: {
    color: "rgba(255,215,0,0.55)",
    font: { size: 14 },
    padding: 10   // ⭐ axis font padding
  },
  grid: {
          display: false,
          color: "rgba(255,255,255,0.08)",
          lineWidth: 1.2,
          drawOnChartArea: false,
          drawTicks: false
        }
      }
    }
  };

  return (
    <section className="space-y-4">

      {/* Header + Badges */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +26.34% Total Return
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            $5,400 Profit
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            5 Months
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            $21,000 Starting Balance
          </span>
        </div>
      </div>

      {/* ⭐ Gradient Background Container */}
      <div className="
        rounded-xl border border-emerald-500/30 p-4 
        bg-gradient-to-b from-[#0f1f1a] via-[#0b0f14] to-[#050608]
        shadow-[0_0_25px_rgba(16,185,129,0.25)]
      ">
        <Line data={data} options={options} plugins={[fxPlugin, gridGlowPlugin]} />
      </div>
    </section>
  );
}

