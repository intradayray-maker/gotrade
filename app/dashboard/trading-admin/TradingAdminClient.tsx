"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type MasterTrade = {
  id: string;
  created_at: string;
  symbol: string;
  side: string;
  qty: number;
  status: string;
};

type FollowerTrade = {
  id: string;
  created_at: string;
  follower_user_id: string;
  symbol: string;
  side: string;
  qty: number;
  status: string;
};

type QueueItem = {
  id: string;
  created_at: string;
  follower_user_id: string;
  symbol: string;
  side: string;
  qty: number;
  status: string;
  last_error: string | null;
};

type TradeError = {
  id: string;
  created_at: string;
  context: string;
  user_id: string | null;
  error_message: string;
};

type SyncLog = {
  id: string;
  created_at: string;
  follower_user_id: string | null;
  symbol: string;
  master_qty: number | null;
  follower_qty: number | null;
  correction_qty: number | null;
  status: string;
};

type TimelineEvent = {
  id: string;
  type: "executor" | "sync" | "error" | "queue";
  created_at: string;
  label: string;
  detail?: string;
};


export default function TradingAdminClient() {
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [masterTrades, setMasterTrades] = useState<MasterTrade[]>([]);
  const [followerTrades, setFollowerTrades] = useState<FollowerTrade[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [errors, setErrors] = useState<TradeError[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(8000);

  // Filters
  const [filterSymbol, setFilterSymbol] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // System health
  const [health, setHealth] = useState({
    brokerConnected: null as boolean | null,
    followerConnections: 0,
    followerHealthy: 0,
    followerUnhealthy: 0,
    queueSize: 0,
    errorCount: 0,
    lastExecutorRun: null as string | null,
    lastSyncRun: null as string | null,
  });

  // Alerts + drawers + timeline
  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedFollower, setSelectedFollower] = useState<{ follower_user_id: string } | null>(null);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueItem | null>(
    null
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);

      let brokerConnected = false;

      try {
        const brokerStatusResponse = await fetch("/api/alpaca/status", {
          cache: "no-store",
        });
        const brokerStatusData = (await brokerStatusResponse.json()) as {
          brokerConnected?: boolean;
        };
        brokerConnected = brokerStatusData.brokerConnected === true;
      } catch (error) {
        console.error("Failed to load broker health:", error);
      }

      const [
        masterRes,
        followerRes,
        queueRes,
        errorsRes,
        syncRes,
        followerConnRes,
        queueQueuedRes,
        errorAllRes,
        executorRes,
        syncHealthRes,
      ] = await Promise.all([
        supabase
          .from("master_trades")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("follower_trades")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("trade_queue")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("trade_errors")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("sync_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("broker_connections").select("*"),
        supabase
          .from("trade_queue")
          .select("*")
          .eq("status", "queued"),
        supabase.from("trade_errors").select("*"),
        supabase
          .from("sync_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("sync_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (!isMounted) return;

      // Health
      setHealth({
        brokerConnected,
        followerConnections: followerConnRes.data?.length ?? 0,
        followerHealthy:
          followerConnRes.data?.filter(
            (f: any) => f.status === "connected"
          ).length ?? 0,
        followerUnhealthy:
          followerConnRes.data?.filter(
            (f: any) => f.status !== "connected"
          ).length ?? 0,
        queueSize: queueQueuedRes.data?.length ?? 0,
        errorCount: errorAllRes.data?.length ?? 0,
        lastExecutorRun: executorRes.data?.[0]?.created_at ?? null,
        lastSyncRun: syncHealthRes.data?.[0]?.created_at ?? null,
      });

      // Core data
      setMasterTrades((masterRes.data as any) ?? []);
      setFollowerTrades((followerRes.data as any) ?? []);
      setQueue((queueRes.data as any) ?? []);
      setErrors((errorsRes.data as any) ?? []);
      setSyncLogs((syncRes.data as any) ?? []);

      // Timeline
      const timeline: TimelineEvent[] = [];

      (executorRes.data ?? []).forEach((e: any) => {
        timeline.push({
          id: `executor-${e.id}`,
          type: "executor",
          created_at: e.created_at,
          label: "Executor run",
        });
      });

      (syncHealthRes.data ?? []).forEach((s: any) => {
        timeline.push({
          id: `sync-${s.id}`,
          type: "sync",
          created_at: s.created_at,
          label: "Sync run",
        });
      });

      (errorsRes.data ?? []).forEach((err: any) => {
        timeline.push({
          id: `error-${err.id}`,
          type: "error",
          created_at: err.created_at,
          label: `Error (${err.context})`,
          detail: err.error_message,
        });
      });

      (queueRes.data ?? []).forEach((q: any) => {
        timeline.push({
          id: `queue-${q.id}`,
          type: "queue",
          created_at: q.created_at,
          label: `Queue: ${q.symbol} ${q.side}`,
          detail: q.status,
        });
      });

      timeline.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setTimelineEvents(timeline.slice(0, 60));

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, refreshInterval);
    return () => clearInterval(id);
  }, [autoRefresh, refreshInterval]);

  async function runFollowerExecutor() {
    setActionLoading("followers");
    try {
      await fetch("/api/trading/followers/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 20 }),
      });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function runPositionSync() {
    setActionLoading("sync");
    try {
      await fetch("/api/trading/sync/positions", {
        method: "POST",
      });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function runAll() {
    setActionLoading("runall");
    try {
      await fetch("/api/trading/followers/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 20 }),
      });

      await fetch("/api/trading/sync/positions", {
        method: "POST",
      });

      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  const totalQueued = queue.filter((q) => q.status === "queued").length;
  const totalErrors = errors.length;


  return (
    <div className="max-w-7xl mx-auto py-10 space-y-8">
      {/* ALERTS BANNER */}
      {showAlerts && (
        <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-100 px-4 py-3 flex items-start justify-between gap-3">
          <div className="space-y-1 text-sm">
            {!health.brokerConnected && (
              <p>⚠️ Broker is disconnected. Trades will not execute.</p>
            )}
            {health.followerUnhealthy > 0 && (
              <p>
                ⚠️ {health.followerUnhealthy} follower
                {health.followerUnhealthy > 1 ? "s" : ""} unhealthy or
                disconnected.
              </p>
            )}
            {health.queueSize > 10 && (
              <p>⚠️ Queue size is high ({health.queueSize} pending trades).</p>
            )}
            {health.errorCount > 0 && (
              <p>⚠️ {health.errorCount} errors logged. Review the error log.</p>
            )}
            {!health.lastExecutorRun && <p>⚠️ Executor has never run.</p>}
            {!health.lastSyncRun && <p>⚠️ Sync has never run.</p>}
            {health.lastExecutorRun &&
              Date.now() - new Date(health.lastExecutorRun).getTime() >
                15 * 60 * 1000 && (
                <p>⚠️ Executor has not run in the last 15 minutes.</p>
              )}
            {health.lastSyncRun &&
              Date.now() - new Date(health.lastSyncRun).getTime() >
                30 * 60 * 1000 && (
                <p>⚠️ Sync has not run in the last 30 minutes.</p>
              )}
            {health.brokerConnected &&
              health.followerUnhealthy === 0 &&
              health.queueSize === 0 &&
              health.errorCount === 0 && (
                <p className="text-emerald-200">
                  ✅ System looks healthy. No active alerts.
                </p>
              )}
          </div>
          <button
            onClick={() => setShowAlerts(false)}
            className="text-xs text-yellow-200 hover:text-yellow-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Trading Engine Admin
          </h1>
          <p className="text-white/60 mt-1">
            Monitor master trades, follower mirroring, queue, errors, and sync
            activity.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 transition"
          >
            Refresh
          </button>
          <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-blue-500"
            />
            Auto-refresh
          </label>
        </div>
      </div>

      {/* SYSTEM HEALTH PANEL */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-xl shadow-black/30">
        <h2 className="text-lg font-semibold text-white mb-3">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthItem
            label="Broker Connection"
            value={health.brokerConnected ? "Connected" : "Disconnected"}
            status={health.brokerConnected ? "ok" : "critical"}
          />
          <HealthItem
            label="Follower Connections"
            value={`${health.followerConnections} connected`}
            status={health.followerConnections > 0 ? "ok" : "warning"}
          />
          <HealthItem
            label="Healthy Followers"
            value={`${health.followerHealthy}`}
            status={health.followerHealthy > 0 ? "ok" : "warning"}
          />
          <HealthItem
            label="Unhealthy Followers"
            value={`${health.followerUnhealthy}`}
            status={health.followerUnhealthy === 0 ? "ok" : "critical"}
          />
          <HealthItem
            label="Queued Trades"
            value={`${health.queueSize} pending`}
            status={
              health.queueSize === 0
                ? "ok"
                : health.queueSize < 10
                ? "warning"
                : "critical"
            }
          />
          <HealthItem
            label="Errors"
            value={`${health.errorCount} logged`}
            status={
              health.errorCount === 0
                ? "ok"
                : health.errorCount < 5
                ? "warning"
                : "critical"
            }
          />
          <HealthItem
            label="Last Executor Run"
            value={
              health.lastExecutorRun
                ? new Date(health.lastExecutorRun).toLocaleString()
                : "Never"
            }
            status={health.lastExecutorRun ? "ok" : "warning"}
          />
          <HealthItem
            label="Last Sync Run"
            value={
              health.lastSyncRun
                ? new Date(health.lastSyncRun).toLocaleString()
                : "Never"
            }
            status={health.lastSyncRun ? "ok" : "warning"}
          />
        </div>
      </div>

      {/* TOP STATS + ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">
              Queued Follower Trades
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/40">
              Queue
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">{totalQueued}</p>
          <button
            onClick={runFollowerExecutor}
            disabled={actionLoading === "followers"}
            className="mt-3 w-full text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 transition"
          >
            {actionLoading === "followers"
              ? "Running Follower Executor..."
              : "Run Follower Executor"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Position Sync</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
              Sync
            </span>
          </div>
          <p className="text-sm text-white/70">
            Ensure follower positions match master allocations.
          </p>
          <button
            onClick={runPositionSync}
            disabled={actionLoading === "sync"}
            className="mt-5 w-full text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-2 transition"
          >
            {actionLoading === "sync"
              ? "Running Position Sync..."
              : "Run Position Sync"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Recent Errors</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/40">
              Errors
            </span>
          </div>
          <p className="text-3xl font-semibold text-red-300">{totalErrors}</p>
          <p className="mt-2 text-xs text-white/60">
            Review and resolve issues in the error log below.
          </p>
        </div>
      </div>

      {/* RUN ALL BUTTON */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Run All</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/40">
            Engine
          </span>
        </div>
        <p className="text-sm text-white/70">
          Executes follower trades and then syncs positions.
        </p>
        <button
          onClick={runAll}
          disabled={actionLoading === "runall"}
          className="mt-5 w-full text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-2 transition"
        >
          {actionLoading === "runall" ? "Running All..." : "Run All"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs text-white/60 mb-1">Symbol</label>
          <input
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm"
            placeholder="AAPL"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-white/60 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm"
          >
            <option value="">All</option>
            <option value="queued">Queued</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-white/60 text-sm">Loading trading engine data…</p>
      )}


      {!loading && (
        <div className="space-y-6">
          {/* MASTER TRADES */}
          <SectionCard
            title="Master Trades"
            subtitle="Latest trades executed on the master account."
          >
            <Table
              columns={["Time", "Symbol", "Side", "Qty", "Status"]}
              rows={masterTrades
                .filter((t: MasterTrade) =>
                  filterSymbol ? t.symbol === filterSymbol : true
                )
                .filter((t: MasterTrade) =>
                  filterStatus ? t.status === filterStatus : true
                )
                .map((t: MasterTrade) => [
                  new Date(t.created_at).toLocaleString(),
                  t.symbol,
                  t.side?.toUpperCase?.() ?? "",
                  t.qty,
                  t.status,
                ])}
              emptyText="No master trades yet."
            />
          </SectionCard>






          {/* FOLLOWER TRADES */}
          <SectionCard
            title="Follower Trades"
            subtitle="Latest mirrored trades across follower accounts."
          >
            <Table
              columns={[
                "Time",
                "Follower",
                "Symbol",
                "Side",
                "Qty",
                "Status",
                "Detail",
              ]}
              rows={followerTrades
                .filter((t: FollowerTrade) =>
                  filterSymbol ? t.symbol === filterSymbol : true
                )
                .filter((t: FollowerTrade) =>
                  filterStatus ? t.status === filterStatus : true
                )
                .map((t: FollowerTrade) => [
                  new Date(t.created_at).toLocaleString(),
                  t.follower_user_id,
                  t.symbol,
                  t.side?.toUpperCase?.() ?? "",
                  t.qty,
                  t.status,
                  <button
                    key={`view-${t.id}`}
                    onClick={() => setSelectedFollower({ follower_user_id: t.follower_user_id })}
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    View
                  </button>,
                ])}
              emptyText="No follower trades yet."
            />
          </SectionCard>

          {/* TRADE QUEUE */}
          <SectionCard
            title="Trade Queue"
            subtitle="Pending, completed, and errored follower trade jobs."
          >
            <Table
              columns={[
                "Time",
                "Follower",
                "Symbol",
                "Side",
                "Qty",
                "Status",
                "Last Error",
                "Inspect",
              ]}
              rows={queue
                .filter((q: QueueItem) =>
                  filterSymbol ? q.symbol === filterSymbol : true
                )
                .filter((q: QueueItem) =>
                  filterStatus ? q.status === filterStatus : true
                )
                .map((q: QueueItem) => [
                  new Date(q.created_at).toLocaleString(),
                  q.follower_user_id,
                  q.symbol,
                  q.side?.toUpperCase?.() ?? "",
                  q.qty,
                  q.status,
                  q.last_error ?? "",
                  <button
                    key={`inspect-${q.id}`}
                    onClick={() => setSelectedQueueItem(q)}
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    Inspect
                  </button>,
                ])}
              emptyText="No queue entries."
            />
          </SectionCard>

          {/* ERRORS */}
          <SectionCard
            title="Error Log"
            subtitle="Recent errors from master, follower, and queue processing."
          >
            <Table
              columns={["Time", "Context", "User", "Message"]}
              rows={errors.map((e: TradeError) => [
                new Date(e.created_at).toLocaleString(),
                e.context,
                e.user_id ?? "",
                e.error_message,
              ])}
              emptyText="No errors logged."
            />
          </SectionCard>

          {/* SYNC LOGS */}
          <SectionCard
            title="Sync Activity"
            subtitle="Position corrections applied to keep followers aligned with master."
          >
            <Table
              columns={[
                "Time",
                "Follower",
                "Symbol",
                "Master Qty",
                "Follower Qty",
                "Correction",
                "Status",
              ]}
              rows={syncLogs
                .filter((s: SyncLog) =>
                  filterSymbol ? s.symbol === filterSymbol : true
                )
                .filter((s: SyncLog) =>
                  filterStatus ? s.status === filterStatus : true
                )
                .map((s: SyncLog) => [
                  new Date(s.created_at).toLocaleString(),
                  s.follower_user_id ?? "",
                  s.symbol,
                  s.master_qty ?? "",
                  s.follower_qty ?? "",
                  s.correction_qty ?? "",
                  s.status,
                ])}
              emptyText="No sync activity yet."
            />
          </SectionCard>

          {/* ENGINE TIMELINE */}
          <SectionCard
            title="Engine Timeline"
            subtitle="Recent executor runs, syncs, errors, and queue activity."
          >
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {timelineEvents.length === 0 && (
                <p className="text-sm text-white/50">
                  No recent engine activity.
                </p>
              )}
              {timelineEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      ev.type === "executor"
                        ? "bg-emerald-400"
                        : ev.type === "sync"
                        ? "bg-blue-400"
                        : ev.type === "error"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <div className="text-sm">
                    <p className="text-white/80">{ev.label}</p>
                    <p className="text-xs text-white/50">
                      {new Date(ev.created_at).toLocaleString()}
                    </p>
                    {ev.detail && (
                      <p className="text-xs text-white/60 mt-0.5">
                        {ev.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* FOLLOWER DETAIL DRAWER */}
      {selectedFollower && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
          <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Follower Detail
                </h2>
                <p className="text-xs text-white/60">{selectedFollower?.follower_user_id ?? ""}</p>
              </div>
              <button
                onClick={() => setSelectedFollower(null)}
                className="text-white/60 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto">
              <SectionCard
                title="Recent Trades"
                subtitle="Latest trades for this follower."
              >
                <Table
                  columns={["Time", "Symbol", "Side", "Qty", "Status"]}
                  rows={followerTrades
                    .filter(
                      (t: FollowerTrade) =>
                        t.follower_user_id ===
                        selectedFollower?.follower_user_id
                    )
                    .map((t: FollowerTrade) => [
                      new Date(t.created_at).toLocaleString(),
                      t.symbol,
                      t.side?.toUpperCase?.() ?? "",
                      t.qty,
                      t.status,
                    ])}
                  emptyText="No trades for this follower."
                />
              </SectionCard>

              <SectionCard
                title="Errors"
                subtitle="Errors associated with this follower."
              >
                <Table
                  columns={["Time", "Context", "Message"]}
                  rows={errors
                    .filter(
                      (e: TradeError) =>
                        e.user_id === selectedFollower?.follower_user_id
                    )
                    .map((e: TradeError) => [
                      new Date(e.created_at).toLocaleString(),
                      e.context,
                      e.error_message,
                    ])}
                  emptyText="No errors for this follower."
                />
              </SectionCard>

              <SectionCard
                title="Sync Activity"
                subtitle="Recent sync corrections for this follower."
              >
                <Table
                  columns={[
                    "Time",
                    "Symbol",
                    "Master Qty",
                    "Follower Qty",
                    "Correction",
                    "Status",
                  ]}
                  rows={syncLogs
                    .filter(
                      (s: SyncLog) =>
                        s.follower_user_id ===
                        selectedFollower?.follower_user_id
                    )
                    .map((s: SyncLog) => [
                      new Date(s.created_at).toLocaleString(),
                      s.symbol,
                      s.master_qty ?? "",
                      s.follower_qty ?? "",
                      s.correction_qty ?? "",
                      s.status,
                    ])}
                  emptyText="No sync activity for this follower."
                />
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE INSPECTOR */}
      {selectedQueueItem && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
          <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Queue Item
                </h2>
                <p className="text-xs text-white/60">
                  {selectedQueueItem.id} •{" "}
                  {new Date(selectedQueueItem.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQueueItem(null)}
                className="text-white/60 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-white/80">
              <p>
                <span className="text-white/60">Follower:</span>{" "}
                {selectedQueueItem.follower_user_id}
              </p>
              <p>
                <span className="text-white/60">Symbol:</span>{" "}
                {selectedQueueItem.symbol}
              </p>
              <p>
                <span className="text-white/60">Side:</span>{" "}
                {selectedQueueItem.side?.toUpperCase?.() ?? ""}
              </p>
              <p>
                <span className="text-white/60">Qty:</span>{" "}
                {selectedQueueItem.qty}
              </p>
              <p>
                <span className="text-white/60">Status:</span>{" "}
                {selectedQueueItem.status}
              </p>
              <p>
                <span className="text-white/60">Last Error:</span>{" "}
                {selectedQueueItem.last_error ?? "None"}
              </p>
            </div>

            <div className="mt-5">
              <button
                onClick={async () => {
                  try {
                    await fetch("/api/trading/queue/retry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: selectedQueueItem.id }),
                    });
                    setSelectedQueueItem(null);
                    setRefreshKey((k) => k + 1);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 transition"
              >
                Retry Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function HealthItem({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "ok" | "warning" | "critical";
}) {
  const badge =
    status === "ok"
      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
      : status === "warning"
      ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300"
      : "bg-red-500/10 border-red-500/40 text-red-300";

  const color =
    status === "ok"
      ? "text-emerald-400"
      : status === "warning"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-white/60">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${badge}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-xl shadow-black/30">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Table({
  columns,
  rows,
  emptyText,
}: {
  columns: string[];
  rows: (string | number | null | undefined | React.ReactNode)[][];
  emptyText: string;
}) {
  if (!rows.length) {
    return <p className="text-sm text-white/50">{emptyText}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase text-white/50">
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-white/5 last:border-0 hover:bg-white/5 transition"
            >
              {row.map((cell, i) => (
                <td key={i} className="px-3 py-2 align-top">
                  {cell ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
