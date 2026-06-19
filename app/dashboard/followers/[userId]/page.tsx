'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFollowerStatus } from '@/hooks/useFollowerStatus';
import { useRouter } from 'next/navigation';

export default function FollowerProfilePage() {
  const router = useRouter();
  const { userId } = useParams();

  const { data, refresh } = useFollowerStatus();
  const follower = data?.followers.find((f) => f.userId === userId);

  const [loadingAction, setLoadingAction] = useState(false);

  /* -----------------------------
     ACTION HANDLERS
  ----------------------------- */

  const runAction = async (endpoint: string) => {
    setLoadingAction(true);
    await fetch(`/api/followers/${userId}/${endpoint}`, { method: 'POST' });
    await refresh();
    setLoadingAction(false);
  };

  const forceSync = () => runAction('force-sync');
  const reconnectBroker = () => runAction('reconnect');
  const toggleDisable = () => runAction('toggle-disable');
  const resetPending = () => runAction('reset-pending');

  /* -----------------------------
     REASON NOT TRADING
  ----------------------------- */

  const getReason = () => {
    if (!follower) return 'Unknown';

    if (follower.allocation <= 0) return 'No Allocation';
    if (follower.disabled) return 'Disabled';
    if (follower.error) return 'Error';
    if (!follower.synced) return 'Out of Sync';

    if (!follower.lastTrade) return 'Idle (No Trade Today)';

    const last = new Date(follower.lastTrade).toDateString();
    const today = new Date().toDateString();
    if (last !== today) return 'Idle (No Trade Today)';

    return 'Healthy';
  };

  /* -----------------------------
     NOT FOUND
  ----------------------------- */
  if (!follower) {
    return (
      <div className="p-6 flex flex-col items-center">
        <div
          className="
          p-[2px] rounded-xl
          bg-gradient-to-br from-rose-600/40 via-rose-500/30 to-rose-700/40
          shadow-[0_0_25px_rgba(0,0,0,0.45)]
          "
        >
          <div className="rounded-xl bg-[#0b0b12] px-6 py-6 text-center">
            <h1 className="text-[20px] font-semibold text-white/90 mb-3">
              Follower Not Found
            </h1>

            <button
              onClick={() => router.push('/dashboard/follower-status')}
              className="text-emerald-300 hover:text-emerald-200 transition text-[17px]"
            >
              ← Back to Follower Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------
     MAIN PAGE
  ----------------------------- */
  return (
    <div className="p-6 space-y-10">

      {/* HEADER + ACTIONS */}
      <div className="relative">

        {/* LEFT SIDE HEADER */}
        <div className="pr-[420px]">
          <h1 className="text-[22px] font-semibold text-white/90 tracking-wide">
            Follower Profile
          </h1>

          {/* HIGHLIGHTED REASON */}
          <div
            className="
            inline-block mt-2
            px-3 py-1.5 rounded-lg text-[17px] font-medium
            bg-gradient-to-br from-rose-600/20 via-rose-500/10 to-rose-700/20
            text-rose-300 border border-rose-500/40
            shadow-[0_0_12px_rgba(0,0,0,0.35)]
            "
          >
            Reason: {getReason()}
          </div>

          <button
            onClick={() => router.push('/dashboard/follower-status')}
            className="block mt-3 text-[17px] text-white/50 hover:text-white transition"
          >
            ← Back
          </button>
        </div>

        {/* ACTION BUTTONS (ABSOLUTE TOP RIGHT, HORIZONTAL) */}
        <div className="absolute top-0 right-0">
          <div
            className="
            p-[2px] rounded-xl
            bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-blue-600/30
            shadow-[0_0_25px_rgba(0,0,0,0.45)]
            "
          >
            <div className="rounded-xl bg-[#0b0b12] p-4">

              <div className="flex items-center gap-3">

                <button
                  onClick={forceSync}
                  disabled={loadingAction}
                  className="
                  w-[120px] h-[48px]
                  rounded-lg text-[17px] font-medium
                  flex items-center justify-center
                  bg-emerald-500/10 text-emerald-300 border border-emerald-500/40
                  hover:bg-emerald-500/20 transition disabled:opacity-40
                  "
                >
                  Force Sync
                </button>

                <button
                  onClick={reconnectBroker}
                  disabled={loadingAction}
                  className="
                  w-[120px] h-[48px]
                  rounded-lg text-[17px] font-medium
                  flex items-center justify-center
                  bg-blue-500/10 text-blue-300 border border-blue-500/40
                  hover:bg-blue-500/20 transition disabled:opacity-40
                  "
                >
                  Reconnect
                </button>

                <button
                  onClick={toggleDisable}
                  disabled={loadingAction}
                  className="
                  w-[120px] h-[48px]
                  rounded-lg text-[17px] font-medium
                  flex items-center justify-center
                  bg-yellow-500/10 text-yellow-300 border border-yellow-500/40
                  hover:bg-yellow-500/20 transition disabled:opacity-40
                  "
                >
                  {follower.disabled ? 'Enable' : 'Disable'}
                </button>

                <button
                  onClick={resetPending}
                  disabled={loadingAction}
                  className="
                  w-[120px] h-[48px]
                  rounded-lg text-[17px] font-medium
                  flex items-center justify-center
                  bg-rose-500/10 text-rose-300 border border-rose-500/40
                  hover:bg-rose-500/20 transition disabled:opacity-40
                  "
                >
                  Reset Queue
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USER INFO CARD */}
      <div
        className="
        p-[2px] rounded-xl
        bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40
        shadow-[0_0_25px_rgba(0,0,0,0.45)]
        "
      >
        <div className="rounded-xl bg-[#0b0b12] p-6 space-y-5">

          {/* GRID INFO */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 text-center">

            {[
              { label: 'Allocation', value: follower.allocation > 0 ? `$${follower.allocation}` : '0 (None)' },
              { label: 'Synced', value: follower.synced ? 'Yes' : 'No' },
              { label: 'Last Trade', value: follower.lastTrade ? new Date(follower.lastTrade).toLocaleTimeString() : '—' },
              { label: 'Last Activity', value: follower.lastActivity ? new Date(follower.lastActivity).toLocaleTimeString() : '—' },
              { label: 'Pending Queue', value: follower.pendingQueue },
              { label: 'Disabled', value: follower.disabled ? 'Yes' : 'No' },
            ].map((item) => (
              <div
                key={item.label}
                className="
                p-[2px] rounded-lg
                bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-600/20
                shadow-[0_0_15px_rgba(0,0,0,0.35)]
                "
              >
                <div className="rounded-lg bg-[#0b0b12] p-4">
                  <div className="text-[17px] text-white/50 font-medium">
                    {item.label}
                  </div>
                  <div className="text-white/90 text-[17px] font-semibold mt-1 leading-tight">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* TRADE HISTORY */}
      <div
        className="
        p-[2px] rounded-xl
        bg-gradient-to-br from-slate-600/30 via-slate-500/20 to-slate-700/30
        shadow-[0_0_25px_rgba(0,0,0,0.45)]
        "
      >
        <div className="rounded-xl bg-[#0b0b12] p-6">
          <h2 className="text-[17px] font-medium text-white/80 mb-3">
            Trade History
          </h2>

          <div className="text-white/50 text-[17px]">
            (You can integrate trade history here once your API endpoint is ready.)
          </div>
        </div>
      </div>

    </div>
  );
}
