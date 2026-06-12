import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔥 RELAX bot writes ONLY to SWING tables
const SWING = {
  barTable: "SWING_bar_state",
  barRow: "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71",

  tradeTable: "SWING_trades_state",
  tradeRow: "81587010-c8c1-4857-a1e8-f476aa04c439",

  newsTable: "SWING_news_state",
  newsRow: "9d5488a8-fefb-4df3-96f7-6347cf1ade87"
};

// Normalize side field
function normalizeSide(side: string | null) {
  if (!side) return null;
  const s = side.toLowerCase();
  if (s === "long") return "long";
  if (s === "short") return "short";
  if (s === "flat") return "flat";
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type;

    // =====================================================================
    // 🔥 BAR UPDATE
    // =====================================================================
    if (type === "bar") {
      const payload = {
        ticker: body.ticker ?? null,
        bot: body.bot ?? null,
        high: Number(body.high) || 0,
        low: Number(body.low) || 0,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from(SWING.barTable)
        .update(payload)
        .eq("id", SWING.barRow);

      return NextResponse.json({ ok: true, status: "bar updated" });
    }

    // =====================================================================
    // 🔥 TRADE UPDATE (entry_long, entry_short, sl, tp)
    // =====================================================================
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      // Validate numeric fields
      if (
        isNaN(body.entry) ||
        isNaN(body.stop) ||
        isNaN(body.tp)
      ) {
        return NextResponse.json(
          { ok: false, error: "invalid numeric values" },
          { status: 400 }
        );
      }

      const payload = {
        type: body.type,
        side: normalizeSide(body.side),
        ticker: body.ticker ?? null,
        bot: body.bot ?? null,
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

    // =====================================================================
    // 🔥 SWING META UPDATE (RELAX ONLY)
    // =====================================================================
    if (type === "swing_meta") {
      // Build payload and only include `ticker` when a non-empty value is provided.
      const payload: any = {
        bot: body.bot ?? null,
        entry_window_text: body.entry_window_text ?? null,
        entry_window_percent: Number(body.entry_window_percent) || null,
        hold_duration_text: body.hold_duration_text ?? null,
        risk_window_note: body.risk_window_note ?? null,
        timestamp: new Date().toISOString()
      };

      if (body.ticker && String(body.ticker).trim() !== "") {
        payload.ticker = String(body.ticker);
      }

      // Debug log for incoming ticker
      console.log("RELAX swing_meta received ticker:", body.ticker);

      await supabase.from(SWING.newsTable).update(payload).eq("id", SWING.newsRow);

      return NextResponse.json({ ok: true, status: "swing_meta updated" });
    }

    // =====================================================================
    // ❌ UNKNOWN TYPE
    // =====================================================================
    return NextResponse.json(
      { ok: false, error: "unknown alert type" },
      { status: 400 }
    );

  } catch (err) {
    console.error("RELAX webhook error:", err);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
