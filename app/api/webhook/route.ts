// app/api/webhook/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// -----------------------------
// EURUSD — original row IDs
// -----------------------------
const TRADE_ROW_ID = "5726f12d-46d7-4e03-8131-a1febfd7ae42";
const BAR_ROW_ID   = "87b8c55f-52c7-4824-9fc7-98febbbdb02d";
const NEWS_ROW_ID  = "d1c4f448-a9f9-4938-ac75-14398ee7aa40";

// -----------------------------
// ETHUSDT.P — row IDs
// -----------------------------
const ETH_TRADE_ROW = "0fee5c83-f233-4487-bc5f-f7e703a14024";
const ETH_BAR_ROW   = "530ef4a6-e3be-4c19-b34e-1d84062170cb";
const ETH_NEWS_ROW  = "40d28923-8f43-464f-8147-244d63141587";

// -----------------------------
// SWING — row IDs
// -----------------------------
const SWING_TRADE_ROW = "81587010-c8c1-4857-a1e8-f476aa04c439";
const SWING_BAR_ROW   = "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71";
const SWING_NEWS_ROW  = "9d5488a8-fefb-4df3-96f7-6347cf1ade87";

// -----------------------------
function normalizeSide(s: any) {
  if (!s) return "flat";
  const v = String(s).toLowerCase();
  if (v === "buy") return "long";
  if (v === "sell") return "short";
  if (["long", "short", "flat"].includes(v)) return v;
  return "flat";
}

// -----------------------------
function getTables(ticker: string) {
  const t = ticker.toUpperCase();

  if (t === "EURUSD") {
    return {
      tradeTable: "EURUSD_trades_state",
      barTable:   "EURUSD_bar_state",
      newsTable:  "EURUSD_news_state",
      tradeRow: TRADE_ROW_ID,
      barRow:   BAR_ROW_ID,
      newsRow:  NEWS_ROW_ID
    };
  }

  if (t === "ETHUSDT.P") {
    return {
      tradeTable: "ETHUSDT_trades_state",
      barTable:   "ETHUSDT_bar_state",
      newsTable:  "ETHUSDT_news_state",
      tradeRow: ETH_TRADE_ROW,
      barRow:   ETH_BAR_ROW,
      newsRow:  ETH_NEWS_ROW
    };
  }

  if (t === "SWING") {
    return {
      tradeTable: "SWING_trades_state",
      barTable:   "SWING_bar_state",
      newsTable:  "SWING_news_state",
      tradeRow: SWING_TRADE_ROW,
      barRow:   SWING_BAR_ROW,
      newsRow:  SWING_NEWS_ROW
    };
  }

  return null;
}

// -----------------------------
export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid json" },
        { status: 400 }
      );
    }

    const type = String(body.type ?? "").toLowerCase();
    const ticker = String(body.ticker ?? "").toUpperCase();

    const tables = getTables(ticker);
    if (!tables) {
      return NextResponse.json({ ok: true, status: "unknown ticker" });
    }

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      const payload = {
        type: body.type,
        side: normalizeSide(body.side),
        entry: Number(body.entry) || null,
        stop: Number(body.stop) || null,
        tp: Number(body.tp) || null,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(tables.tradeTable)
        .update(payload)
        .eq("id", tables.tradeRow);

      return NextResponse.json({ ok: true, status: "trade updated" });
    }

    // -----------------------------
    // BAR UPDATE
    // -----------------------------
    if (type === "bar") {
      const payload = {
        high: Number(body.high) || null,
        low: Number(body.low) || null,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(tables.barTable)
        .update(payload)
        .eq("id", tables.barRow);

      return NextResponse.json({ ok: true, status: "bar updated" });
    }

    // -----------------------------
    // NEWS UPDATE (EURUSD / ETHUSDT.P / SWING)
    // -----------------------------
    if (type === "news" || type === "swing_news") {
      let payload: any = {
        timestamp: new Date().toISOString()
      };

      // EURUSD + ETHUSDT.P format
      if (type === "news") {
        payload.news_today = Boolean(body.news_today);
        payload.news_message = body.news_message ?? null;
        payload.next_news_time = body.next_news_time ?? null;
        payload.news_window_active = Boolean(body.news_window_active);
        payload.news_countdown = Number(body.news_countdown) || null;
      }

      // SWING format
      if (type === "swing_news") {
        payload.entry_window_text = body.entry_window_text ?? null;
        payload.entry_window_percent = Number(body.entry_window_percent) || null;
        payload.hold_duration_text = body.hold_duration_text ?? null;
        payload.risk_window_note = body.risk_window_note ?? null;
      }

      await supabase
        .from(tables.newsTable)
        .update(payload)
        .eq("id", tables.newsRow);

      return NextResponse.json({ ok: true, status: "news updated" });
    }

    return NextResponse.json({ ok: true, status: "ignored" });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "unexpected error" },
      { status: 400 }
    );
  }
}
