import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// RELAX BOT (SWING) — row IDs (from you)
const RELAX = {
  tradeTable: "SWING_trades_state",
  barTable:   "SWING_bar_state",
  newsTable:  "SWING_news_state",
  tradeRow: "81587010-c8c1-4857-a1e8-f476aa04c439",
  barRow:   "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71",
  newsRow:  "9d5488a8-fefb-4df3-96f7-6347cf1ade87"
};

function normalizeSide(side: unknown) {
  if (!side || typeof side !== "string") return null;
  const s = side.toLowerCase();
  if (s === "long" || s === "short" || s === "flat") return s;
  return null;
}

function isFiniteNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Debug: always log incoming body for quick diagnosis
    console.log("WEBHOOK BODY:", JSON.stringify(body));

    const type = body?.type;

    // -------------------------
    // BAR update
    // -------------------------
    if (type === "bar") {
      const payload = {
        ticker: body.ticker ?? null,
        high: Number(body.high) || 0,
        low: Number(body.low) || 0,
        timestamp: new Date().toISOString()
      };

      console.log("BAR UPDATE payload:", payload);

      const { data, error } = await supabase
        .from(RELAX.barTable)
        .update(payload)
        .eq("id", RELAX.barRow)
        .select();

      if (error) {
        console.error("BAR UPDATE ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      if (!data || data.length === 0) {
        console.warn("BAR UPDATE: no rows matched id", RELAX.barRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      console.log("BAR UPDATE RESULT:", data);
      return NextResponse.json({ ok: true, status: "bar updated", data });
    }

    // -------------------------
    // TRADE update (entry_long, entry_short, sl, tp)
    // -------------------------
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      // Validate numeric fields strictly
      if (!isFiniteNumber(body.entry) || !isFiniteNumber(body.stop) || !isFiniteNumber(body.tp)) {
        console.error("TRADE VALIDATION FAILED:", { entry: body.entry, stop: body.stop, tp: body.tp });
        return NextResponse.json({ ok: false, error: "invalid numeric values" }, { status: 400 });
      }

      const payload = {
        type: body.type ?? null,
        side: normalizeSide(body.side),
        ticker: body.ticker ?? null,
        entry: Number(body.entry),
        stop: Number(body.stop),
        tp: Number(body.tp),
        timestamp: new Date().toISOString()
      };

      console.log("TRADE UPDATE payload:", payload);

      const { data, error } = await supabase
        .from(RELAX.tradeTable)
        .update(payload)
        .eq("id", RELAX.tradeRow)
        .select();

      if (error) {
        console.error("TRADE UPDATE ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      if (!data || data.length === 0) {
        console.warn("TRADE UPDATE: no rows matched id", RELAX.tradeRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      console.log("TRADE UPDATE RESULT:", data);
      return NextResponse.json({ ok: true, status: "trade updated", data });
    }

    // -------------------------
    // SWING META update (RELAX only)
    // -------------------------
    if (type === "swing_meta") {
      // Build payload WITHOUT 'bot' (table has no bot column)
      const payload = {
        ticker: body.ticker ?? null,
        entry_window_text: body.entry_window_text ?? null,
        entry_window_percent: isFiniteNumber(body.entry_window_percent)
          ? Number(body.entry_window_percent)
          : null,
        hold_duration_text: body.hold_duration_text ?? null,
        risk_window_note: body.risk_window_note ?? null,
        timestamp: new Date().toISOString()
      };

      console.log("SWING_META payload:", payload);

      const { data, error } = await supabase
        .from(RELAX.newsTable)
        .update(payload)
        .eq("id", RELAX.newsRow)
        .select();

      console.log("SWING_META UPDATE response:", { data, error });

      if (error) {
        console.error("SWING_META ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      if (!data || data.length === 0) {
        console.warn("SWING_META: no rows matched id", RELAX.newsRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      console.log("SWING_META RESULT:", data);
      return NextResponse.json({ ok: true, status: "swing_meta updated", data });
    }

    // Unknown type
    console.warn("UNKNOWN ALERT TYPE:", type);
    return NextResponse.json({ ok: false, error: "unknown alert type" }, { status: 400 });

  } catch (err) {
    console.error("RELAX webhook error:", err);
    return NextResponse.json({ ok: false, error: "server error", detail: String(err) }, { status: 500 });
  }
}
