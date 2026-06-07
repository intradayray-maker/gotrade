// app/api/webhook/route.ts

export const runtime = "edge"; // <--- ADD THIS LINE

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ROW_ID = "65f3ad34-2fd0-4dab-91c2-80fc676198e9";

export async function POST(req: Request) {
  const body = await req.json();

// @ts-ignore - waitUntil exists in Edge Runtime
  req.waitUntil(handleWebhook(body));

  return NextResponse.json({ ok: true });
}

async function handleWebhook(body: any) {
  try {
    const type = body.type;

    const { data: existing, error: fetchError } = await supabase
      .from("trade_state")
      .select("*")
      .eq("id", ROW_ID)
      .single();

    if (fetchError || !existing) {
      console.error("FETCH ERROR:", fetchError);
      return;
    }

    let payload = { ...existing };

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (type === "trade") {
      console.log("TRADE BLOCK HIT:", body);

      const rawSide = String(body.side || "").toLowerCase();

      if (rawSide === "buy" || rawSide === "long") payload.side = "long";
      else if (rawSide === "sell" || rawSide === "short") payload.side = "short";
      else payload.side = existing.side;

      payload.ticker = body.ticker ?? existing.ticker;

      payload.entry = Number(body.entry) || existing.entry;
      payload.stop = Number(body.stop) || existing.stop;

      const tp = Number(body.tp);
      payload.tp = isNaN(tp) ? existing.tp : tp;

      payload.timestamp = new Date().toISOString();
    }

    // -----------------------------
    // BAR UPDATE
    // -----------------------------
    if (type === "bar") {
      if (existing.side !== "flat") {
        console.log("BAR IGNORED — active position:", existing.side);
        return;
      }

      console.log("BAR BLOCK HIT:", body);

      const high = Number(body.high);
      const low = Number(body.low);

      if (!isNaN(high)) payload.high = high;
      if (!isNaN(low)) payload.low = low;

      payload.timestamp = new Date().toISOString();

      if (body.news_today !== undefined)
        payload.news_today = Boolean(body.news_today);

      if (body.news_message !== undefined)
        payload.news_message = body.news_message;

      if (body.next_news_time !== undefined)
        payload.next_news_time = body.next_news_time;

      if (body.news_window_active !== undefined)
        payload.news_window_active = Boolean(body.news_window_active);

      if (body.news_countdown !== undefined)
        payload.news_countdown = Number(body.news_countdown);
    }

    // -----------------------------
    // WRITE MERGED PAYLOAD
    // -----------------------------
    const { error: updateError } = await supabase
      .from("trade_state")
      .update(payload)
      .eq("id", ROW_ID);

    if (updateError) {
      console.error("UPDATE ERROR:", updateError);
    } else {
      console.log("SUPABASE UPDATED:", payload);
    }
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
  }
}
