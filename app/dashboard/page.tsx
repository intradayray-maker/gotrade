'use client';

import EquityCurveChart from '@/components/dashboard/EquityCurveChart';
import GoalsDonut from '@/components/dashboard/GoalsDonut';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import AccountSummaryGrid from '@/components/dashboard/AccountSummaryGrid';
import RecentTradesTable from '@/components/dashboard/RecentTradesTable';
import NotificationsPreview from '@/components/dashboard/NotificationsPreview';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Your trading overview and system insights.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <AccountSummaryGrid />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">
                Equity Curve & Benchmark
              </h2>
              <span className="text-xs text-slate-500">
                Last 90 days (mock data)
              </span>
            </div>
            <EquityCurveChart />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">
                  Goal Tracking
                </h2>
                <span className="text-xs text-slate-500">Weekly / Monthly / Yearly</span>
              </div>
              <GoalsDonut />
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
              <h2 className="mb-3 text-sm font-medium text-slate-200">
                Performance Metrics
              </h2>
              <PerformanceMetrics />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">
                Recent Trades
              </h2>
              <span className="text-xs text-slate-500">Last 10 trades</span>
            </div>
            <RecentTradesTable />
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">
                Notifications
              </h2>
              <span className="text-xs text-slate-500">Preview</span>
            </div>
            <NotificationsPreview />
          </div>
        </section>
      </main>
    </div>
  );
}
