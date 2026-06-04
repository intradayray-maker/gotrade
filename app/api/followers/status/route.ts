import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const followerSelect = `
      user_id,
      trader_id,
      allocation,
      enabled,
      is_enabled,
      last_heartbeat,
      last_master_trade_id,
      last_follower_trade_id
    `;

    // Read the full follower set with service-role access so RLS does not
    // hide seeded dashboard data.
    const { data: followers, error } = await supabase
      .from('copy_trading_settings')
      .select(followerSelect);

    if (error) throw error;

    const followerRows = followers ?? [];
    const followerIds = followerRows.map((f: any) => f.user_id).filter(Boolean);

    let profileById = new Map<
      string,
      { first_name: string | null; last_name: string | null }
    >();

    if (followerIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', followerIds);

      if (profileError) throw profileError;

      profileById = new Map(
        (profiles ?? []).map((p: any) => [
          p.id,
          {
            first_name: p.first_name ?? null,
            last_name: p.last_name ?? null,
          },
        ])
      );
    }

    const { data: queue } = await supabase
      .from('trade_queue')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: followerTrades } = await supabase
      .from('follower_trades')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: syncLogs } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false });

    const latestSyncByFollower = new Map<string, any>();
    for (const log of syncLogs ?? []) {
      if (!latestSyncByFollower.has(log.follower_user_id)) {
        latestSyncByFollower.set(log.follower_user_id, log);
      }
    }

    const status = followerRows.map((f: any) => {
      const pending =
        queue?.filter((q) => q.follower_user_id === f.user_id) ?? [];

      const lastTrade =
        followerTrades?.find((t) => t.follower_user_id === f.user_id);
      const sync = latestSyncByFollower.get(f.user_id) ?? null;

      const profile = profileById.get(f.user_id);
      const isActive = Boolean(f.enabled ?? f.is_enabled);

      return {
        userId: f.user_id,
        first_name: profile?.first_name ?? null,
        last_name: profile?.last_name ?? null,
        allocation: f.allocation,
        connected: !!f.last_heartbeat,
        synced: f.last_master_trade_id === f.last_follower_trade_id,
        error: pending.some((p) => p.status === 'error'),
        disabled: !isActive || f.allocation === 0,
        lastActivity: f.last_heartbeat,
        lastTrade: lastTrade?.created_at ?? null,
        pendingQueue: pending.length,
        sync_status: sync?.status ?? 'synced',
        sync_reason: sync?.error_message ?? null,
        sync_symbol: sync?.symbol ?? null,
        sync_correction_qty: sync?.correction_qty ?? null,
        sync_timestamp: sync?.created_at ?? null,
        healthScore: 100,
      };
    });

    return NextResponse.json(
      {
        followers: status,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[FollowerStatusRoute] Fatal error:', err?.message || err);
    return NextResponse.json(
      {
        error: 'Failed to load follower status',
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}
