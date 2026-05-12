import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { executeMasterTrade } from "@/utils/trading/masterExecutor";

const WEBHOOK_SECRET = process.env.TRADINGVIEW_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type TradingViewPayload = {
  secret?: string;
  symbol?: string;
  side?: "buy" | "sell";
  qty?: number;
  price?: number;
  [key: string]: any;
};

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      console.error("TRADINGVIEW_WEBHOOK_SECRET is not set");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
      });
    }

    let body: TradingViewPayload;
    try {
      body = (await req.json()) as TradingViewPayload;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
      });
    }

    // 1) Secret validation
    if (!body.secret || body.secret !== WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // 2) Basic payload validation
    const symbol = body.symbol?.toUpperCase();
    const side = body.side;
    const qty = Number(body.qty);
    const price = body.price !== undefined ? Number(body.price) : null;

    if (!symbol || !side || !["buy", "sell"].includes(side) || !qty || qty <= 0) {
      return new Response(JSON.stringify({ error: "Invalid signal payload" }), {
        status: 400,
      });
    }

    // 3) Insert into master_signals
    const { data, error } = await supabase
      .from("master_signals")
      .insert({
        symbol,
        side,
        qty,
        price,
        raw_payload: body,
        valid: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting master_signal:", error);
      return new Response(JSON.stringify({ error: "Failed to record signal" }), {
        status: 500,
      });
    }

    // ⭐ 4) Trigger master trade executor
    await executeMasterTrade({
      symbol,
      side,
      qty,
    });

    return new Response(
      JSON.stringify({
        success: true,
        signal_id: data.id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("TradingView webhook error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
    });
  }
}
