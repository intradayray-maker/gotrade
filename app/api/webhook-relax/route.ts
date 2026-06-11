export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// -----------------------------
// RELAX BOT → SWING TABLES
// -----------------------------
const SWING = {
  tradeTable: "SWING_trades_state",
  barTable:   "SWING_bar_state",
  newsTable:  "SWING_news_state",
  tradeRow: "81587010-c8c1-4857-a1e8-f476aa04c439",
  barRow:   "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71",
  newsRow:  "9d5488a8-fefb-4df3-96f7-6347cf1ade87"
};

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

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      // Prevent NaN issues
      if (isNaN(body.entry) || isNaN(body.stop) || isNaN(body.tp)) {
        return NextResponse.json(
          { ok: false, error: "invalid numeric values" },
          { status: 400 }
        );
      }

      const payload = {
        type: body.type,
        side: normalizeSide(body.side),
        entry: Number(body.entry),
        stop: Number(body.stop),
        tp: Number(body.tp),
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(SWING.tradeTable)
        .update(payload)
        .eq("id", SWING.tradeRow);

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
        .from(SWING.barTable)
        .update(payload)
        .eq("id", SWING.barRow);

      return NextResponse.json({ ok: true, status: "bar updated" });
    }

    // -----------------------------
    // SWING META UPDATE
    // -----------------------------
    if (type === "swing_meta") {
      const payload = {
        entry_window_text: body.entry_window_text ?? null,
        entry_window_percent: Number(body.entry_window_percent) || null,
        hold_duration_text: body.hold_duration_text ?? null,
        risk_window_note: body.risk_window_note ?? null,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(SWING.newsTable)
        .update(payload)
        .eq("id", SWING.newsRow);

      return NextResponse.json({ ok: true, status: "swing_meta updated" });
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
