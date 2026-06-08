// app/api/webhook/route.ts
// NODE RUNTIME — EURUSD unchanged + ETHUSDT.P added

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

// -----------------------------
// EURUSD — your original row IDs
// -----------------------------
const TRADE_ROW_ID = "5726f12d-46d7-4e03-8131-a1febfd7ae42";
const BAR_ROW_ID   = "87b8c55f-52c7-4824-9fc7-98febbbdb02d";
const NEWS_ROW_ID  = "d1c4f448-a9f9-4938-ac75-14398ee7aa40";

// -----------------------------
// ETHUSDT.P — new row IDs
// -----------------------------
const ETH_TRADE_ROW = "0fee5c83-f233-4487-bc5f-f7e703a14024";
const ETH_BAR_ROW   = "530ef4a6-e3be-4c19-b34e-1d84062170cb";
const ETH_NEWS_ROW  = "40d28923-8f43-464f-8147-244d63141587";

// -----------------------------
function normalizeSide(s: any) {
  if (!s) return "flat";
  const v = String(s).toLowerCase();
  if (v === "buy") return "long";
  if (v === "sell") return "short";
  if (["long", "short", "flat"].includes(v)) return v;
  return "flat";
}

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

  return null;
}

// -----------------------------
export async function POST(req: Request) {
  try {
    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
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
    // NEWS UPDATE
    // -----------------------------
    if (type === "news") {
      const payload = {
        news_today: Boolean(body.news_today),
        news_message: body.news_message ?? null,
        next_news_time: body.next_news_time ?? null,
        news_window_active: Boolean(body.news_window_active),
        news_countdown: Number(body.news_countdown) || null,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(tables.newsTable)
        .update(payload)
        .eq("id", tables.newsRow);

      return NextResponse.json({ ok: true, status: "news updated" });
    }

    return NextResponse.json({ ok: true, status: "ignored" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "unexpected error" }, { status: 400 });
  }
}
