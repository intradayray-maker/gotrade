import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

export async function POST(req: NextRequest) {
  try {
    // Optional: allow overriding batch size via body
    const { limit = 20 } = (await safeJson(req)) ?? {};

    // 1. Fetch queued follower trades
    const { data: queue, error: queueErr } = await supabase
      .from("trade_queue")
      .select("*")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (queueErr) {
      console.error("Failed to fetch trade_queue:", queueErr);
      return json({ error: "Failed to fetch queue" }, 500);
    }

    if (!queue || queue.length === 0) {
      return json({ success: true, processed: 0, message: "No queued trades" }, 200);
    }

    let processed = 0;
    const errors: any[] = [];

    for (const job of queue) {
      try {
        await processFollowerJob(job);
        processed++;
      } catch (err: any) {
        console.error("Follower job error:", err);

        errors.push({
          job_id: job.id,
          error: err?.message ?? "Unknown error",
        });

        // Update queue row with error
        await supabase
          .from("trade_queue")
          .update({
            status: "error",
            attempts: (job.attempts ?? 0) + 1,
            last_error: err?.message ?? "Unknown error",
          })
          .eq("id", job.id);

        // Log into trade_errors
        await supabase.from("trade_errors").insert({
          context: "follower",
          user_id: job.follower_user_id,
          master_trade_id: job.master_trade_id,
          error_message: err?.message ?? "Unknown error",
          payload: job,
        });
      }
    }

    return json(
      {
        success: true,
        processed,
        errors,
      },
      200
    );
  } catch (err) {
    console.error("Follower executor fatal error:", err);
    return json({ error: "Unexpected server error" }, 500);
  }
}

/* -------------------------------------------------------
   ⭐ RISK ENGINE — Prevents unsafe follower trades
------------------------------------------------------- */
async function riskCheck(
  followerUserId: string,
  symbol: string,
  side: "buy" | "sell",
  qty: number
) {
  // 1. Load follower settings
  const { data: settings, error: settingsErr } = await supabase
    .from("copy_trading_settings")
    .select("*")
    .eq("user_id", followerUserId)
    .single();

  if (settingsErr || !settings) {
    throw new Error("Missing follower settings");
  }

  const maxDailyLoss = Number(settings.max_daily_loss ?? 0);
  const maxPositionSize = Number(settings.max_position_size ?? 0);

  // 2. Load follower positions
  const { data: position } = await supabase
    .from("follower_positions")
    .select("*")
    .eq("follower_user_id", followerUserId)
    .eq("symbol", symbol)
    .single();

  const currentQty = Number(position?.qty ?? 0);

  // 3. Max position size check
  const projectedQty = side === "buy" ? currentQty + qty : currentQty - qty;

  if (maxPositionSize > 0 && Math.abs(projectedQty) > maxPositionSize) {
    throw new Error("Max position size exceeded");
  }

  // 4. Daily loss check (simple version)
  const { data: tradesToday } = await supabase
    .from("follower_trades")
    .select("filled_qty, filled_avg_price, side")
    .eq("follower_user_id", followerUserId)
    .gte("created_at", new Date().toISOString().split("T")[0]); // today

  let pnl = 0;

  if (tradesToday) {
    for (const t of tradesToday) {
      const qty = Number(t.filled_qty ?? 0);
      const price = Number(t.filled_avg_price ?? 0);
      pnl += t.side === "buy" ? -qty * price : qty * price;
    }
  }

  if (maxDailyLoss > 0 && pnl < -maxDailyLoss) {
    throw new Error("Max daily loss exceeded");
  }

  return true;
}

/* -------------------------------------------------------
   ⭐ PROCESS FOLLOWER JOB
------------------------------------------------------- */
async function processFollowerJob(job: any) {
  const followerUserId = job.follower_user_id;
  const symbol = job.symbol;
  const side = job.side;
  const qty = Number(job.qty);

  if (!followerUserId || !symbol || !side || !qty || qty <= 0) {
    throw new Error("Invalid job payload");
  }

  // ⭐ RISK CHECK BEFORE ANY TRADE
  await riskCheck(followerUserId, symbol, side, qty);

  // 1. Load follower broker connection
  const { data: conn, error: connErr } = await supabase
    .from("broker_connections")
    .select("*")
    .eq("user_id", followerUserId)
    .eq("broker", "alpaca")
    .single();

  if (connErr || !conn) {
    throw new Error("Follower broker not connected");
  }

  const keyId = conn.key_id;
  const secretKey = conn.secret_key;
  const environment = conn.environment; // 'paper' | 'live'

  const alpacaUrl =
    environment === "live"
      ? "https://api.alpaca.markets"
      : "https://paper-api.alpaca.markets";

  // 2. Place follower order via Alpaca
  const orderPayload = {
    symbol,
    qty,
    side,
    type: "market",
    time_in_force: "gtc",
  };

  const alpacaRes = await fetch(`${alpacaUrl}/v2/orders`, {
    method: "POST",
    headers: {
      "APCA-API-KEY-ID": keyId,
      "APCA-API-SECRET-KEY": secretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  const alpacaData = await alpacaRes.json();

  if (!alpacaRes.ok) {
    console.error("Follower Alpaca order error:", alpacaData);
    throw new Error(
      `Alpaca follower order failed: ${alpacaData?.message ?? "Unknown"}`
    );
  }

  // 3. Insert into follower_trades
  const { data: followerTrade, error: ftErr } = await supabase
    .from("follower_trades")
    .insert({
      master_trade_id: job.master_trade_id,
      follower_user_id: followerUserId,
      order_id: alpacaData.id,
      symbol,
      side,
      qty,
      filled_qty: alpacaData.filled_qty ?? null,
      filled_avg_price: alpacaData.filled_avg_price ?? null,
      status: alpacaData.status ?? "submitted",
    })
    .select()
    .single();

  if (ftErr) {
    console.error("Failed to insert follower_trade:", ftErr);
    throw new Error("Failed to log follower trade");
  }

  // 4. Update follower_positions
  await upsertFollowerPosition(followerUserId, symbol, side, qty, alpacaData);

  // 5. Mark queue job as completed
  await supabase
    .from("trade_queue")
    .update({
      status: "completed",
      attempts: (job.attempts ?? 0) + 1,
      last_error: null,
    })
    .eq("id", job.id);
}

/* -------------------------------------------------------
   ⭐ UPSERT FOLLOWER POSITION
------------------------------------------------------- */
async function upsertFollowerPosition(
  followerUserId: string,
  symbol: string,
  side: "buy" | "sell",
  qty: number,
  alpacaOrder: any
) {
  // Fetch existing position
  const { data: existing, error: posErr } = await supabase
    .from("follower_positions")
    .select("*")
    .eq("follower_user_id", followerUserId)
    .eq("symbol", symbol)
    .single();

  if (posErr && posErr.code !== "PGRST116") {
    console.error("Error fetching follower position:", posErr);
  }

  const filledQty = Number(alpacaOrder.filled_qty ?? qty);
  const filledPrice = Number(alpacaOrder.filled_avg_price ?? 0);

  let newQty = 0;
  let newAvgPrice = filledPrice;

  if (!existing) {
    newQty = side === "buy" ? filledQty : -filledQty;
  } else {
    const currentQty = Number(existing.qty);
    const currentAvg = Number(existing.avg_price ?? 0);

    if (side === "buy") {
      const totalShares = currentQty + filledQty;
      if (totalShares <= 0) {
        newQty = totalShares;
        newAvgPrice = 0;
      } else {
        const totalCost =
          currentQty * currentAvg + filledQty * filledPrice;
        newQty = totalShares;
        newAvgPrice = totalCost / totalShares;
      }
    } else {
      newQty = currentQty - filledQty;
      newAvgPrice = newQty <= 0 ? 0 : currentAvg;
    }
  }

  if (!existing) {
    await supabase.from("follower_positions").insert({
      follower_user_id: followerUserId,
      symbol,
      qty: newQty,
      avg_price: newAvgPrice,
    });
  } else {
    await supabase
      .from("follower_positions")
      .update({
        qty: newQty,
        avg_price: newAvgPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  }
}

/* -------------------------------------------------------
   ⭐ UTILITIES
------------------------------------------------------- */
async function safeJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
