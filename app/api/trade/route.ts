// app/api/trade/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract fields TradingView sends
    const payload = {
      side: body.side ?? null,
      ticker: body.ticker ?? null,
      entry: body.entry ?? null,
      stop: body.stop ?? null,
      tp: body.tp ?? null,
      timestamp: body.timestamp ?? new Date().toISOString(),

      news_today: body.news_today ?? null,
      news_message: body.news_message ?? null,
      next_news_time: body.next_news_time ?? null,
      news_window_active: body.news_window_active ?? null,
      news_countdown: body.news_countdown ?? null,
    };

    // Update the single row
    const { error } = await supabase
      .from("trade_state")
      .update(payload)
      .eq("id", (await getSingleId()));

    if (error) {
      console.error("SUPABASE TRADE UPDATE ERROR:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("TRADE WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

async function getSingleId() {
  const { data, error } = await supabase
    .from("trade_state")
    .select("id")
    .limit(1)
    .single();

  if (error || !data) throw new Error("trade_state row missing");
  return data.id;
}
