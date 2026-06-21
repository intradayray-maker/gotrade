'use client';

import { useState, useMemo } from 'react';
import { useFollowerStatus } from '@/hooks/useFollowerStatus';
import { useLivePnl } from '@/hooks/useLivePnl';
import { useRouter } from 'next/navigation';

import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function FollowerStatusCard() {

const router = useRouter();

const [sortKey, setSortKey] = useState<string>('name');
const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

const toggleSort = (key: string) => {
  if (sortKey === key) {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
  } else {
    setSortKey(key);
    setSortDir('asc');
  }
};


const { data, error, isLoading } = useFollowerStatus();
const { data: pnlData } = useLivePnl();

const followers = data?.followers ?? [];

/* -----------------------------
   SEARCH + SORT STATE
----------------------------- */
const [search, setSearch] = useState('');
const [view, setView] = useState<'grid' | 'table'>('table');

/* -----------------------------
   ⭐ CRITICAL FILTER STATE
----------------------------- */
const [criticalFilter, setCriticalFilter] = useState<
  'drift' | 'errors' | 'out_of_sync' | 'disabled' | 'no_allocation' | 'idle' | 'none'
>('none');

/* -----------------------------
   SEARCH FILTER
----------------------------- */
const searchedFollowers = useMemo(() => {
if (!search.trim()) return followers;

const q = search.toLowerCase();

return followers.filter((f: any) =>
`${f.first_name} ${f.last_name}`.toLowerCase().includes(q) ||
f.userId?.toLowerCase().includes(q)
);
}, [followers, search]);

/* -----------------------------
   DRIFT SEVERITY
----------------------------- */
const getDriftSeverity = (f: any) => {
const syncStatus = f.sync_status ?? '';

if (syncStatus === 'drift_correction_failed') return 3;
if (syncStatus === 'drift_detected') return 2;
if (syncStatus.startsWith('drift_correction')) return 1;

// If we do not have sync-log metadata yet, treat an unsynced follower
// as a drift candidate so the filter still surfaces actionable rows.
if (!f.synced && !f.error && !f.disabled) return 1;

return 0;
};

/* -----------------------------
   HEALTH SCORE
----------------------------- */
const getHealthScore = (f: any) => {
let score = 100;

if (!f.connected) score -= 40;
if (!f.synced) score -= 25;
score -= getDriftSeverity(f) * 10;
if (f.error) score -= 30;
if (f.allocation <= 0) score -= 20;

const last = f.lastActivity ? new Date(f.lastActivity).getTime() : 0;
const now = Date.now();
const hours = (now - last) / (1000 * 60 * 60);

if (hours > 24) score -= 10;
if (hours > 72) score -= 20;

return Math.max(0, Math.min(100, score));
};

/* -----------------------------
   ⭐ CRITICAL FILTER LOGIC
----------------------------- */
const criticallyFilteredFollowers = useMemo(() => {
return searchedFollowers.filter((f: any) => {
if (criticalFilter === 'none') return true;
if (criticalFilter === 'errors') return !!f.error;
if (criticalFilter === 'out_of_sync') return !f.synced && !f.error && !f.disabled;
if (criticalFilter === 'disabled') return !!f.disabled;
if (criticalFilter === 'no_allocation') return (f.allocation ?? 0) <= 0;
if (criticalFilter === 'drift') return getDriftSeverity(f) > 0;
if (criticalFilter === 'idle') {
  if (f.error || f.disabled || f.allocation <= 0 || !f.synced) return false;
  if (!f.lastTrade) return true;
  const last = new Date(f.lastTrade).toDateString();
  const today = new Date().toDateString();
  return last !== today;
}
return true;
});
}, [searchedFollowers, criticalFilter]);

/* -----------------------------
   ENRICHED FOLLOWERS
----------------------------- */
const enrichedFollowers = criticallyFilteredFollowers.map((f: any) => ({
...f,
healthScore: getHealthScore(f),
driftSeverity: getDriftSeverity(f),
}));


const sortedFollowers = useMemo(() => {
  const arr = [...enrichedFollowers];

  arr.sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;

      switch (sortKey) {
      case 'name':
        return (
          `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim().localeCompare(
            `${b.first_name ?? ''} ${b.last_name ?? ''}`.trim()
          ) * dir
        );

      case 'health':
        return (a.healthScore - b.healthScore) * dir;

      case 'drift':
        return (a.driftSeverity - b.driftSeverity) * dir;

      case 'allocation':
        return (a.allocation - b.allocation) * dir;

      case 'status':
        return (a.sync_status ?? '').localeCompare(b.sync_status ?? '') * dir;

      case 'lastActivity':
        return (
          (new Date(a.lastActivity).getTime() || 0) -
          (new Date(b.lastActivity).getTime() || 0)
        ) * dir;

      case 'lastTrade':
        return (
          (new Date(a.lastTrade).getTime() || 0) -
          (new Date(b.lastTrade).getTime() || 0)
        ) * dir;

      default:
        return 0;
    }
  });

  return arr;
}, [enrichedFollowers, sortKey, sortDir]);


/* -----------------------------
   HEALTH INDICATOR
----------------------------- */
const getHealthIndicator = (score: number) => {
if (score >= 80) return { icon: '🟢', label: 'Healthy', color: 'text-emerald-400' };
if (score >= 60) return { icon: '🟡', label: 'Moderate', color: 'text-yellow-400' };
if (score >= 40) return { icon: '🟠', label: 'Weak', color: 'text-orange-400' };
return { icon: '🔴', label: 'Critical', color: 'text-rose-400' };
};

/* -----------------------------
   TOP BAR (Themed)
----------------------------- */
const TopBar = (
<div
className="
w-full
flex items-center justify-between
flex-wrap gap-4
mb-6
"
>

  {/* SEARCH FIELD (gradient shell) */}
  <div className="flex items-center w-full sm:w-auto flex-1 max-w-[320px]">
    <div
    className="
    w-full
    p-[2px] rounded-xl
    bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40
    shadow-[0_0_25px_rgba(0,0,0,0.5)]
    "
    >
      <div
      className="
      flex items-center gap-2 w-full
      rounded-xl bg-[#0b0b12]
      px-3 py-2
      "
      >
        <MagnifyingGlassIcon className="w-4 h-4 text-white/40" />
        <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search followers..."
        className="
        bg-transparent outline-none text-white/80 text-[14px] w-full
        "
        />
      </div>
    </div>
  </div>

  {/* GRID / TABLE TOGGLE (gradient shell) */}
  <div
  className="
  mx-auto
  p-[2px] rounded-xl
  bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-blue-600/30
  shadow-[0_0_18px_rgba(0,0,0,0.45)]
  "
  >
    <div
    className="
    rounded-xl bg-[#0b0b12]
    flex items-center
    "
    >
      <button
        onClick={() => setView('grid')}
        className={`
          px-4 py-1.5 rounded-xl text-sm font-medium
          transition
          ${view === 'grid'
            ? "bg-blue-300 text-black shadow-[0_0_14px_rgba(59,130,246,0.55)]"
            : "bg-transparent text-white/80 hover:bg-blue-500/10 hover:text-white"
          }
        `}
      >
        Grid
      </button>

      <button
        onClick={() => setView('table')}
        className={`
          px-4 py-1.5 rounded-xl text-sm font-medium
          transition
          ${view === 'table'
            ? "bg-blue-300 text-black shadow-[0_0_14px_rgba(59,130,246,0.55)]"
            : "bg-transparent text-white/80 hover:bg-blue-500/10 hover:text-white"
          }
        `}
      >
        Table
      </button>
    </div>
  </div>

  {/* TIME + PNL */}
  <div className="flex items-center gap-4">

    <span className="text-[14px] font-semibold text-white/80">
      {data
        ? new Date(data.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '—'}
    </span>

    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

    <div
    className={`
    text-[13px] px-3 py-1 rounded-xl
    ${
      (pnlData?.dayPnl ?? 0) >= 0
        ? 'bg-emerald-500/10 text-emerald-300'
        : 'bg-rose-500/10 text-rose-300'
    }
    `}
    >
      {(pnlData?.dayPnl ?? 0) >= 0 ? '▲' : '▼'}{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(pnlData?.dayPnl ?? 0)}
      {' '}
      (
      {`${(pnlData?.dayPnlPct ?? 0) >= 0 ? '+' : ''}${(pnlData?.dayPnlPct ?? 0).toFixed(2)}%`}
      )
    </div>

  </div>

</div>
);

/* -----------------------------
   ⭐ CRITICAL FILTER BUTTONS (Soft Blue Theme)
----------------------------- */
const CriticalButtons = (
<div className="flex flex-wrap justify-center gap-3 mb-6">

  {[
    { key: 'drift', label: 'Drift' },
    { key: 'errors', label: 'Errors' },
    { key: 'out_of_sync', label: 'Out of Sync' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'no_allocation', label: 'No Allocation' },
    { key: 'idle', label: 'Idle' },
  ].map(({ key, label }) => {
    const active = criticalFilter === key;

    return (
      <button
        key={key}
        onClick={() => setCriticalFilter(key as any)}
        className={`
          px-4 py-1.5 text-sm font-medium rounded-xl transition
          ${active
            ? "bg-blue-300 text-black shadow-[0_0_14px_rgba(59,130,246,0.55)]"
            : "bg-[#0b0b12] text-white/80 hover:bg-blue-500/10 hover:text-white"
          }
          p-[2px]
          bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-blue-600/30
          shadow-[0_0_18px_rgba(0,0,0,0.45)]
        `}
      >
        {label}
      </button>
    );
  })}

  {/* RESET */}
  <button
    onClick={() => setCriticalFilter('none')}
    className={`
      px-4 py-1.5 text-sm font-medium rounded-xl transition
      ${criticalFilter === 'none'
        ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.55)]"
        : "bg-[#0b0b12] text-white/80 hover:bg-white/10"
      }
      p-[2px]
      bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-blue-600/30
      shadow-[0_0_18px_rgba(0,0,0,0.45)]
    `}
  >
    All
  </button>

</div>
);

/* -----------------------------
   ANALYTICS / DIAGNOSTICS (Gradient Cards)
----------------------------- */
const AnalyticsRow = (
<div
className="
w-full
flex flex-wrap justify-center
gap-2
mb-6
"
>

  {[
    { label: 'Total', value: followers.length, color: 'text-white' },
    { label: 'Healthy', value: followers.filter(f => f.connected && f.synced && !f.error && !f.disabled).length, color: 'text-emerald-300' },
    { label: 'Out of Sync', value: followers.filter(f => !f.synced && !f.error && !f.disabled).length, color: 'text-amber-300' },
    { label: 'Errors', value: followers.filter(f => f.error).length, color: 'text-rose-300' },
    { label: 'No Allocation', value: followers.filter(f => f.allocation <= 0).length, color: 'text-purple-300' },
    { label: 'Disabled', value: followers.filter(f => f.disabled).length, color: 'text-slate-300' },
    { label: 'Idle', value: followers.filter(f => {
        if (f.error || f.disabled || f.allocation <= 0 || !f.synced) return false;
        if (!f.lastTrade) return true;
        const last = new Date(f.lastTrade).toDateString();
        const today = new Date().toDateString();
        return last !== today;
      }).length, color: 'text-sky-300'
    },
  ].map(({ label, value, color }) => (
    <div
      key={label}
      className="
      min-w-[95px]
      p-[2px]
      rounded-xl
      bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40
      shadow-[0_0_25px_rgba(0,0,0,0.45)]
      "
    >
      <div className="rounded-xl bg-[#0b0b12] px-4 py-3 flex flex-col items-center">
        <p className="text-white/70 text-[13px]">{label}</p>
        <p className={`text-[20px] font-semibold mt-1 ${color}`}>{value}</p>
      </div>
    </div>
  ))}

</div>
);

/* -----------------------------
   GRID VIEW (unchanged per your choice)
----------------------------- */
const FollowerGrid = (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
    {enrichedFollowers.map((f: any) => {
      let statusColor = 'text-slate-400';
      let statusLabel = 'Idle';

      if (f.disabled) {
        statusColor = 'text-slate-500';
        statusLabel = 'Disabled';
      } else if (f.error) {
        statusColor = 'text-rose-400';
        statusLabel = 'Error';
      } else if (f.driftSeverity === 3) {
        statusColor = 'text-rose-400';
        statusLabel = 'Severe Drift';
      } else if (f.driftSeverity === 2) {
        statusColor = 'text-orange-400';
        statusLabel = 'Moderate Drift';
      } else if (f.driftSeverity === 1) {
        statusColor = 'text-yellow-400';
        statusLabel = 'Mild Drift';
      } else if (!f.synced) {
        statusColor = 'text-yellow-400';
        statusLabel = 'Out of Sync';
      } else if (f.connected) {
        statusColor = 'text-emerald-400';
        statusLabel = 'Connected';
      }

      const health = getHealthIndicator(f.healthScore);

      const driftBadge =
        f.driftSeverity === 3 ? (
          <span className="inline-flex items-center rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/40 px-2 py-1 text-[11px]">
            Severe Drift
          </span>
        ) : f.driftSeverity === 2 ? (
          <span className="inline-flex items-center rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/40 px-2 py-1 text-[11px]">
            Moderate Drift
          </span>
        ) : f.driftSeverity === 1 ? (
          <span className="inline-flex items-center rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/40 px-2 py-1 text-[11px]">
            Mild Drift
          </span>
        ) : f.sync_status?.startsWith('drift_correction') ? (
          <span className="inline-flex items-center rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/40 px-2 py-1 text-[11px]">
            Auto-Corrected
          </span>
        ) : null;

      return (
        <div
          key={f.userId}
          onClick={() => router.push(`/dashboard/followers/${f.userId}`)}
          className="
            cursor-pointer rounded-md border border-white/10
            bg-[rgb(5,5,5)] p-4
            shadow-[0_0_22px_rgba(0,0,0,0.45)]
            hover:border-emerald-400/40 transition
          "
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-[17px] font-semibold tracking-wide">
              {f.first_name} {f.last_name}
            </p>
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                f.connected ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[18px] ${health.color}`}>{health.icon}</span>
            <span className={`text-[13px] ${health.color}`}>{health.label}</span>
          </div>

          {driftBadge && <div className="mt-3">{driftBadge}</div>}

          {f.sync_reason && (
            <div className="text-[11px] text-white/50 mt-2">
              Reason:{' '}
              <span className="text-white/80">{f.sync_reason}</span>
            </div>
          )}

          {f.sync_correction_qty !== null &&
            f.sync_correction_qty !== undefined && (
              <div className="text-[11px] text-white/50">
                Correction qty:{' '}
                <span className="text-white/80">{f.sync_correction_qty}</span>
              </div>
            )}

          {f.sync_timestamp && (
            <div className="text-[11px] text-white/40 mt-1">
              Synced:{' '}
              <span>
                {new Date(f.sync_timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      );
    })}
  </div>
);


/* -----------------------------
   TABLE VIEW (Themed Gradient Shell)
----------------------------- */
const FollowerTable = (
<div
className="
w-full
overflow-x-auto
p-[2px] rounded-xl
bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40
shadow-[0_0_25px_rgba(0,0,0,0.45)]
"
>
<div className="rounded-xl bg-[#060606] overflow-hidden">


<table className="w-full text-left text-white/20 text-[17px]">


      <thead className="bg-[#000000] border-b border-slate-800/40">
        <tr>
          {[
            { key: 'name', label: 'Name' },
            { key: 'health', label: 'Health' },
            { key: 'drift', label: 'Drift' },
            { key: 'allocation', label: 'Allocation' },
            { key: 'status', label: 'Status' },
            { key: 'lastActivity', label: 'Last Activity' },
            { key: 'lastTrade', label: 'Last Trade' },
          ].map(({ key, label }) => (
            <th
              key={key}
              onClick={() => toggleSort(key)}
              className="
                p-4 font-semibold text-white/60 cursor-pointer select-none
                hover:text-white transition
              "
            >
              <div className="flex items-center gap-1">
                {label}
                {sortKey === key && (
                  <span className="text-white/40">
                    {sortDir === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>

        {sortedFollowers.map((f: any) => {

          const health = getHealthIndicator(f.healthScore);

          let statusLabel = 'Idle';
          if (f.disabled) statusLabel = 'Disabled';
          else if (f.error) statusLabel = 'Error';
          else if (f.driftSeverity === 3) statusLabel = 'Severe Drift';
          else if (f.driftSeverity === 2) statusLabel = 'Moderate Drift';
          else if (f.driftSeverity === 1) statusLabel = 'Mild Drift';
          else if (!f.synced) statusLabel = 'Out of Sync';
          else if (f.connected) statusLabel = 'Connected';

          return (
            <tr
            key={f.userId}
            onClick={() => router.push(`/dashboard/followers/${f.userId}`)}
            className="
            cursor-pointer
            hover:bg-white/5
            transition
            border-b border-slate-800/30
            "
            >

              <td className="p-4 font-medium text-white/90">
                {f.first_name} {f.last_name}
              </td>

              <td className={`p-4 font-semibold ${health.color}`}>
                {health.label}
              </td>

              <td className="p-4 text-white/80">
                {f.driftSeverity === 3
                  ? 'Severe'
                  : f.driftSeverity === 2
                  ? 'Moderate'
                  : f.driftSeverity === 1
                  ? 'Mild'
                  : 'None'}
              </td>

              <td className="p-4 text-emerald-300 font-semibold">
                 {f.allocation > 0 ? `$${f.allocation}` : '0 (None)'}
              </td>

              <td className="p-4 text-white/80">
                {statusLabel}
              </td>

              <td className="p-4 text-white/80">
                {f.lastActivity
                  ? new Date(f.lastActivity).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>

              <td className="p-4 text-white/80">
                {f.lastTrade
                  ? new Date(f.lastTrade).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>

            </tr>
          );
        })}

      </tbody>

    </table>

  </div>
</div>
);

/* -----------------------------
   LOADING STATE (Themed)
----------------------------- */
if (isLoading) {
  return (
    <div className="p-4 flex justify-center">
      <div
        className="
        px-6 py-4 rounded-xl text-white/70 text-[14px]
        bg-[#0b0b12]
        shadow-[0_0_25px_rgba(0,0,0,0.45)]
        border border-slate-800/40
        "
      >
        Loading follower status...
      </div>
    </div>
  );
}

/* -----------------------------
   EMPTY STATE (Themed)
----------------------------- */
if (followers.length === 0) {
  return (
    <div className="p-4 flex justify-center">
      <div
        className="
        px-6 py-10 rounded-xl text-white/70 text-[14px]
        bg-[#0b0b12]
        shadow-[0_0_25px_rgba(0,0,0,0.45)]
        border border-slate-800/40
        "
      >
        No followers found.
      </div>
    </div>
  );
}

/* -----------------------------
   EMPTY SEARCH RESULT (Themed)
----------------------------- */
if (enrichedFollowers.length === 0) {
  return (
    <div className="p-4">

      {TopBar}
      {CriticalButtons}
      {AnalyticsRow}

      <div
        className="
        mt-6 px-6 py-10 rounded-xl text-white/70 text-[14px]
        bg-[#0b0b12]
        shadow-[0_0_25px_rgba(0,0,0,0.45)]
        border border-slate-800/40
        text-center
        "
      >
        No followers match your filters.
      </div>
    </div>
  );
}

/* -----------------------------
   MAIN RETURN BLOCK (Themed)
----------------------------- */
return (
<div className="p-4">

  {TopBar}

  {CriticalButtons}

  {AnalyticsRow}

  {view === 'grid' ? FollowerGrid : FollowerTable}

</div>
);
}
