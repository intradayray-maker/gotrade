import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ALPACA_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.alpaca.markets"
    : "https://paper-api.alpaca.markets";

// Service role client (needed to read encrypted keys + insert trades)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

export async function POST(req: NextRequest) {
  try {
    const { signal_id } = await req.json();

    if (!signal_id) {
      return new Response(
        JSON.stringify({ error: "Missing signal_id" }),
        { status: 400 }
      );
    }

    // 1. Fetch the signal
    const { data: signal, error: signalErr } = await supabase
      .from("master_signals")
      .select("*")
      .eq("id", signal_id)
      .single();

    if (signalErr || !signal) {
      return new Response(
        JSON.stringify({ error: "Signal not found" }),
        { status: 404 }
      );
    }

    const { symbol, side, qty } = signal;

    // 2. Load master account keys
    const { data: masterConn, error: connErr } = await supabase
      .from("broker_connections")
      .select("*")
      .eq("user_id", process.env.MASTER_USER_ID) // ⭐ your master account user ID
      .eq("broker", "alpaca")
      .single();

    if (connErr || !masterConn) {
      return new Response(
        JSON.stringify({ error: "Master broker not connected" }),
        { status: 500 }
      );
    }

    // Decrypt keys
    const keyId = masterConn.key_id;
    const secretKey = masterConn.secret_key;
    const environment = masterConn.environment; // paper/live

    const alpacaUrl =
      environment === "live"
        ? "https://api.alpaca.markets"
        : "https://paper-api.alpaca.markets";

    // 3. Execute master trade via Alpaca
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
      console.error("Alpaca order error:", alpacaData);
      return new Response(
        JSON.stringify({ error: "Alpaca order failed", details: alpacaData }),
        { status: 500 }
      );
    }

    // 4. Insert into master_trades
    const { data: masterTrade, error: tradeErr } = await supabase
      .from("master_trades")
      .insert({
        signal_id,
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

    if (tradeErr) {
      console.error("Failed to insert master trade:", tradeErr);
      return new Response(
        JSON.stringify({ error: "Failed to log master trade" }),
        { status: 500 }
      );
    }

    // 5. Seed follower queue
    const { data: followers } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation_mode, allocation_value, risk_multiplier");

    if (followers && followers.length > 0) {
      const queueRows = followers.map((f) => ({
        master_trade_id: masterTrade.id,
        follower_user_id: f.user_id,
        symbol,
        side,
        qty: calculateFollowerQty(qty, f),
        status: "queued",
      }));

      await supabase.from("trade_queue").insert(queueRows);
    }

    return new Response(
      JSON.stringify({
        success: true,
        master_trade_id: masterTrade.id,
        alpaca_order: alpacaData,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Master executor error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500 }
    );
  }
}

// ⭐ Allocation engine
function calculateFollowerQty(masterQty: number, follower: any) {
  const mode = follower.allocation_mode;
  const value = Number(follower.allocation_value);
  const risk = Number(follower.risk_multiplier ?? 1);

  if (mode === "percent") {
    return Number((masterQty * (value / 100) * risk).toFixed(2));
  }

  if (mode === "fixed") {
    return Number((value * risk).toFixed(2));
  }

  return masterQty; // fallback
}
