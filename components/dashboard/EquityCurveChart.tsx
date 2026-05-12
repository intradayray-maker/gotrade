'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
);

const labels = Array.from({ length: 30 }).map((_, i) => `Day ${i + 1}`);

const equityData = [
  10000, 10050, 10020, 10100, 10040, 10180, 10250, 10190, 10320, 10400,
  10320, 10450, 10520, 10400, 10380, 10560, 10640, 10720, 10600, 10780,
  10850, 10920, 10800, 10980, 11050, 11120, 11000, 11180, 11250, 11320,
];

const spyData = [
  10000, 10020, 10040, 10060, 10080, 10100, 10120, 10140, 10160, 10180,
  10200, 10220, 10240, 10260, 10280, 10300, 10320, 10340, 10360, 10380,
  10400, 10420, 10440, 10460, 10480, 10500, 10520, 10540, 10560, 10580,
];

export default function EquityCurveChart() {
  const data = {
    labels,
    datasets: [
      {
        label: 'Equity',
        data: equityData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
      {
        label: 'SPY Benchmark',
        data: spyData,
        borderColor: '#38bdf8',
        borderDash: [4, 4],
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          boxWidth: 14,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', maxTicksLimit: 6 },
        grid: { color: 'rgba(31,41,55,0.6)' },
      },
      y: {
        ticks: { color: '#6b7280' },
        grid: { color: 'rgba(31,41,55,0.6)' },
      },
    },
  };

  return (
    <div className="h-64 md:h-72">
      <Line data={data} options={options} />
    </div>
  );
}
