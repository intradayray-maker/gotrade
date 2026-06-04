// app/api/cron/sync-follower-positions/route.ts

import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { getPositions } from "@/lib/brokers/router"

type LivePosition = {
  symbol: string
  qty: number
  avg_price: number
}

export async function GET() {
  const supabase = await createSupabaseServerClient()

  console.log("🩺 Follower Drift Sync: START")

  // 1) Load all followers that are enabled for copy-trading
  const { data: followers, error: followersErr } = await supabase
    .from("copy_trading_settings")
    .select("user_id")
    .eq("enabled", true)

  if (followersErr) {
    console.error("❌ Error loading followers:", followersErr)
    return NextResponse.json(
      { error: "Failed to load followers" },
      { status: 500 },
    )
  }

  const uniqueFollowerIds = Array.from(
    new Set((followers ?? []).map((f) => f.user_id).filter(Boolean)),
  ) as string[]

  console.log("👥 Followers to sync:", uniqueFollowerIds.length)

  const logEvents: {
    follower_user_id: string
    symbol: string
    master_qty: number | null
    follower_qty: number | null
    correction_qty: number | null
    status: string
    error_message: string | null
  }[] = []

  for (const followerId of uniqueFollowerIds) {
    console.log("🔍 Syncing follower:", followerId)

    // 2) Load DB snapshot of follower positions
    const { data: dbPositions, error: dbPosErr } = await supabase
      .from("follower_positions")
      .select("symbol, qty, avg_price")
      .eq("follower_user_id", followerId)

    if (dbPosErr) {
      console.error("❌ Error loading DB positions:", followerId, dbPosErr)
      logEvents.push({
        follower_user_id: followerId,
        symbol: "",
        master_qty: null,
        follower_qty: null,
        correction_qty: null,
        status: "db_positions_error",
        error_message: dbPosErr.message ?? "Unknown DB positions error",
      })
      continue
    }

    const dbMap = new Map<string, { qty: number; avg_price: number | null }>()
    for (const p of dbPositions ?? []) {
      dbMap.set(p.symbol, {
        qty: p.qty,
        avg_price: p.avg_price,
      })
    }

    // 3) Load LIVE positions from broker
    let livePositions: LivePosition[] = []
    try {
      livePositions = await getPositions(followerId)
    } catch (err: any) {
      console.error("❌ Error loading live positions from broker:", followerId, err)
      logEvents.push({
        follower_user_id: followerId,
        symbol: "",
        master_qty: null,
        follower_qty: null,
        correction_qty: null,
        status: "broker_positions_error",
        error_message: err?.message ?? "Unknown broker positions error",
      })
      continue
    }

    const liveMap = new Map<string, LivePosition>()
    for (const p of livePositions) {
      liveMap.set(p.symbol, p)
    }

    // 4) Compare DB vs LIVE
    const allSymbols = new Set<string>([
      ...Array.from(dbMap.keys()),
      ...Array.from(liveMap.keys()),
    ])

    for (const symbol of allSymbols) {
      const dbPos = dbMap.get(symbol) ?? { qty: 0, avg_price: null }
      const livePos = liveMap.get(symbol) ?? { qty: 0, avg_price: 0 }

      const dbQty = dbPos.qty ?? 0
      const liveQty = livePos.qty ?? 0

      if (dbQty === liveQty) {
        continue // in sync
      }

      const correctionQty = liveQty - dbQty

      console.log("⚠️ Drift detected:", {
        follower_user_id: followerId,
        symbol,
        dbQty,
        liveQty,
        correctionQty,
      })

      // Base drift log
      logEvents.push({
        follower_user_id: followerId,
        symbol,
        master_qty: null,
        follower_qty: dbQty,
        correction_qty: correctionQty,
        status: "drift_detected",
        error_message: null,
      })

      // 5) SAFE AUTO-CORRECTION LOGIC
      // -------------------------------------------------
      // Rules:
      // - If master is flat and follower is not -> force exit (handled elsewhere via master exit mirroring)
      // - Here we only reconcile DB snapshot to LIVE, not re-enter trades.
      // - If DB says position but LIVE is flat -> mark DB flat.
      // - If LIVE says position but DB is flat -> update DB to match LIVE.
      // - If both non-zero but different -> update DB to match LIVE (DB is just a mirror).
      // -------------------------------------------------

      // Case A: DB has position, LIVE is flat -> mark DB flat
      if (dbQty !== 0 && liveQty === 0) {
        console.log("🔁 Auto-correct: DB shows position, LIVE is flat. Marking DB flat.", {
          follower_user_id: followerId,
          symbol,
          dbQty,
          liveQty,
        })

        const { error: updateErr } = await supabase
          .from("follower_positions")
          .update({
            qty: 0,
            avg_price: null,
          })
          .eq("follower_user_id", followerId)
          .eq("symbol", symbol)

        if (updateErr) {
          console.error("❌ Error updating DB to flat:", updateErr)
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: dbQty,
            correction_qty: correctionQty,
            status: "drift_correction_failed",
            error_message: updateErr.message ?? "Failed to mark DB flat",
          })
        } else {
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: liveQty,
            correction_qty: correctionQty,
            status: "drift_correction_db_flat",
            error_message: null,
          })
        }

        continue
      }

      // Case B: DB is flat, LIVE has position -> mirror LIVE into DB
      if (dbQty === 0 && liveQty !== 0) {
        console.log("🔁 Auto-correct: DB flat, LIVE has position. Mirroring LIVE into DB.", {
          follower_user_id: followerId,
          symbol,
          dbQty,
          liveQty,
        })

        const { error: upsertErr } = await supabase
          .from("follower_positions")
          .upsert(
            {
              follower_user_id: followerId,
              symbol,
              qty: liveQty,
              avg_price: livePos.avg_price ?? null,
            },
            {
              onConflict: "follower_user_id,symbol",
            },
          )

        if (upsertErr) {
          console.error("❌ Error mirroring LIVE into DB:", upsertErr)
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: dbQty,
            correction_qty: correctionQty,
            status: "drift_correction_failed",
            error_message: upsertErr.message ?? "Failed to mirror LIVE into DB",
          })
        } else {
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: liveQty,
            correction_qty: correctionQty,
            status: "drift_correction_db_mirrored",
            error_message: null,
          })
        }

        continue
      }

      // Case C: Both non-zero but different -> update DB to match LIVE
      if (dbQty !== 0 && liveQty !== 0 && dbQty !== liveQty) {
        console.log("🔁 Auto-correct: DB and LIVE both non-zero but different. Updating DB to match LIVE.", {
          follower_user_id: followerId,
          symbol,
          dbQty,
          liveQty,
        })

        const { error: updateErr } = await supabase
          .from("follower_positions")
          .update({
            qty: liveQty,
            avg_price: livePos.avg_price ?? dbPos.avg_price ?? null,
          })
          .eq("follower_user_id", followerId)
          .eq("symbol", symbol)

        if (updateErr) {
          console.error("❌ Error updating DB to match LIVE:", updateErr)
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: dbQty,
            correction_qty: correctionQty,
            status: "drift_correction_failed",
            error_message: updateErr.message ?? "Failed to update DB to match LIVE",
          })
        } else {
          logEvents.push({
            follower_user_id: followerId,
            symbol,
            master_qty: null,
            follower_qty: liveQty,
            correction_qty: correctionQty,
            status: "drift_correction_db_updated",
            error_message: null,
          })
        }

        continue
      }
    }
  }

  // 6) Persist all events into sync_logs
  if (logEvents.length > 0) {
    console.log("📝 Writing sync events to sync_logs:", logEvents.length)

    const { error: syncErr } = await supabase
      .from("sync_logs")
      .insert(
        logEvents.map((e) => ({
          follower_user_id: e.follower_user_id,
          symbol: e.symbol,
          master_qty: e.master_qty,
          follower_qty: e.follower_qty,
          correction_qty: e.correction_qty,
          status: e.status,
          error_message: e.error_message,
        })),
      )

    if (syncErr) {
      console.error("❌ Error writing sync_logs:", syncErr)
    }
  } else {
    console.log("✅ No drift detected for any follower.")
  }

  console.log("✅ Follower Drift Sync: DONE")

  return NextResponse.json({
    followers_checked: uniqueFollowerIds.length,
    events_logged: logEvents.length,
  })
}
