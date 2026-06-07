import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // body from Pine:
    // type: "trade" | "bar"
    // side, ticker, entry, stop, tp, timestamp
    // news_today, news_message, next_news_time,
    // news_window_active, news_countdown,
    // high, low

    const payload = {
      side: body.side,
      ticker: body.ticker,
      entry: body.entry,
      stop: body.stop,
      tp: body.tp,
      timestamp: body.timestamp,

      news_today: body.news_today,
      news_message: body.news_message,
      next_news_time: body.next_news_time,
      news_window_active: body.news_window_active,
      news_countdown: body.news_countdown,

      high: body.high,
      low: body.low
    };

    const { error } = await supabase
      .from("trade_state")
      .update(payload)
      .eq("id", (await getSingleId()));

    if (error) {
      console.error("SUPA UPDATE ERROR", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("WEBHOOK ERROR", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
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
