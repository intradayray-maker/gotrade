import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createSupabaseServerClient()

  // Load followers
  const { data: followers } = await supabase
    .from("copy_trading_settings")
    .select("user_id, enabled, allocation")

  // Load follower positions
  const { data: positions } = await supabase
    .from("follower_positions")
    .select("*")

  // Load pending queue
  const { data: queue } = await supabase
    .from("trade_queue")
    .select("follower_user_id, status")

  // Load latest sync logs
  const { data: syncLogs } = await supabase
    .from("sync_logs")
    .select("*")
    .order("created_at", { ascending: false })

  const latestSyncByFollower = new Map()
  for (const log of syncLogs ?? []) {
    if (!latestSyncByFollower.has(log.follower_user_id)) {
      latestSyncByFollower.set(log.follower_user_id, log)
    }
  }

  const result = followers?.map((f) => {
    const pos = positions?.find((p) => p.follower_user_id === f.user_id)
    const pending = queue?.filter(
      (q) => q.follower_user_id === f.user_id && q.status === "pending"
    ).length

    const sync = latestSyncByFollower.get(f.user_id) ?? null

    return {
      user_id: f.user_id,
      enabled: f.enabled,
      allocation: f.allocation,
      position: pos ?? null,
      pending,
      sync_status: sync?.status ?? "synced",
      sync_reason: sync?.error_message ?? null,
      sync_symbol: sync?.symbol ?? null,
      sync_correction_qty: sync?.correction_qty ?? null,
      sync_timestamp: sync?.created_at ?? null,
    }
  })

  return NextResponse.json(result)
}
