export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// -----------------------------
// EURUSD — row IDs
// -----------------------------
const EURUSD = {
  tradeTable: "EURUSD_trades_state",
  barTable:   "EURUSD_bar_state",
  newsTable:  "EURUSD_news_state",
  tradeRow: "5726f12d-46d7-4e03-8131-a1febfd7ae42",
  barRow:   "87b8c55f-52c7-4824-9fc7-98febbbdb02d",
  newsRow:  "d1c4f448-a9f9-4938-ac75-14398ee7aa40"
};

// -----------------------------
// ETH BOT — row IDs
// -----------------------------
const ETH = {
  tradeTable: "ETHUSDT_trades_state",
  barTable:   "ETHUSDT_bar_state",
  newsTable:  "ETHUSDT_news_state",
  tradeRow: "0fee5c83-f233-4487-bc5f-f7e703a14024",
  barRow:   "530ef4a6-e3be-4c19-b34e-1d84062170cb",
  newsRow:  "40d28923-8f43-464f-8147-244d63141587"
};

// -----------------------------
// RELAX BOT (SWING) — row IDs
// -----------------------------
const RELAX = {
  tradeTable: "SWING_trades_state",
  barTable:   "SWING_bar_state",
  newsTable:  "SWING_news_state",
  tradeRow: "81587010-c8c1-4857-a1e8-f476aa04c439",
  barRow:   "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71",
  newsRow:  "9d5488a8-fefb-4df3-96f7-6347cf1ade87"
};

// -----------------------------
// BOT ROUTER (case-insensitive)
// -----------------------------
function getBotTables(bot: string | null | undefined) {
  if (!bot) return RELAX; // default to RELAX when bot missing
  const b = String(bot).trim().toUpperCase();
  if (b === "EURUSD") return EURUSD;
  if (b === "ETH" || b === "ETHUSDT") return ETH;
  if (b === "RELAX" || b === "SWING") return RELAX;
  return null;
}

// -----------------------------
// Helpers
// -----------------------------
function sanitizeString(v: unknown) {
  if (v === null || v === undefined) return null;
  const s = String(v);
  // remove control chars (0x00-0x1F and 0x7F), keep printable characters
  const cleaned = s.replace(/[\u0000-\u001F\u007F]/g, "");
  // trim and return
  return cleaned.trim();
}

function normalizeSide(s: unknown) {
  if (!s) return "flat";
  const v = String(s).toLowerCase();
  if (v === "buy") return "long";
  if (v === "sell") return "short";
  if (["long", "short", "flat"].includes(v)) return v;
  return "flat";
}

function isFiniteNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n);
}

// -----------------------------
// Handler
// -----------------------------
export async function POST(req: Request) {
  // create supabase client inside handler (server-side only)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Read raw body and log it for debugging
  const raw = await req.text();
  console.log("RAW WEBHOOK BODY:", raw);

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err, "RAW_BODY:", raw);
    return NextResponse.json({ ok: false, error: "invalid JSON", detail: String(err) }, { status: 400 });
  }

  console.log("WEBHOOK BODY (parsed):", JSON.stringify(body));

  try {
    const type = String(body.type ?? "").toLowerCase();
    const botKey = body.bot ?? "relax";
    const tables = getBotTables(botKey);

    if (!tables) {
      console.warn("Unknown bot:", botKey);
      return NextResponse.json({ ok: false, error: "unknown bot" }, { status: 400 });
    }

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      // strict numeric validation
      if (!isFiniteNumber(body.entry) || !isFiniteNumber(body.stop) || !isFiniteNumber(body.tp)) {
        console.error("TRADE VALIDATION FAILED:", { entry: body.entry, stop: body.stop, tp: body.tp });
        return NextResponse.json({ ok: false, error: "invalid numeric values" }, { status: 400 });
      }

      const payload = {
        type: sanitizeString(body.type),
        side: normalizeSide(body.side),
        ticker: sanitizeString(body.ticker),
        entry: Number(body.entry),
        stop: Number(body.stop),
        tp: Number(body.tp),
        timestamp: new Date().toISOString()
      };

      console.log("TRADE UPDATE payload:", payload);

      const { data, error } = await supabase
        .from(tables.tradeTable)
        .update(payload)
        .eq("id", tables.tradeRow)
        .select();

      console.log("TRADE UPDATE response:", { data, error });

      if (error) {
        console.error("TRADE UPDATE ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }
      if (!data || data.length === 0) {
        console.warn("TRADE UPDATE: no rows matched id", tables.tradeRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      return NextResponse.json({ ok: true, status: "trade updated", data });
    }

    // -----------------------------
    // BAR UPDATE
    // -----------------------------
    if (type === "bar") {
      const payload = {
        ticker: sanitizeString(body.ticker),
        high: isFiniteNumber(body.high) ? Number(body.high) : null,
        low: isFiniteNumber(body.low) ? Number(body.low) : null,
        timestamp: new Date().toISOString()
      };

      console.log("BAR UPDATE payload:", payload);

      const { data, error } = await supabase
        .from(tables.barTable)
        .update(payload)
        .eq("id", tables.barRow)
        .select();

      console.log("BAR UPDATE response:", { data, error });

      if (error) {
        console.error("BAR UPDATE ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }
      if (!data || data.length === 0) {
        console.warn("BAR UPDATE: no rows matched id", tables.barRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      return NextResponse.json({ ok: true, status: "bar updated", data });
    }

    // -----------------------------
    // NEWS / SWING META UPDATE
    // -----------------------------
    if (type === "news" || type === "swing_news" || type === "swing_meta") {
      // base payload
      const payload: any = {
        timestamp: new Date().toISOString()
      };

      // EURUSD + ETH format
      if (type === "news") {
        payload.news_today = Boolean(body.news_today);
        payload.news_message = sanitizeString(body.news_message);
        payload.next_news_time = sanitizeString(body.next_news_time);
        payload.news_window_active = Boolean(body.news_window_active);
        payload.news_countdown = isFiniteNumber(body.news_countdown) ? Number(body.news_countdown) : null;
      }

      // RELAX format (swing_meta / swing_news)
      if (type === "swing_news" || type === "swing_meta") {
        payload.ticker = sanitizeString(body.ticker);
        payload.entry_window_text = sanitizeString(body.entry_window_text);
        payload.entry_window_percent = isFiniteNumber(body.entry_window_percent)
          ? Number(body.entry_window_percent)
          : null;
        payload.hold_duration_text = sanitizeString(body.hold_duration_text);
        payload.risk_window_note = sanitizeString(body.risk_window_note);
      }

      console.log("NEWS/SWING payload:", payload);

      const { data, error } = await supabase
        .from(tables.newsTable)
        .update(payload)
        .eq("id", tables.newsRow)
        .select();

      console.log("NEWS UPDATE response:", { data, error });

      if (error) {
        console.error("NEWS UPDATE ERROR:", error);
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }
      if (!data || data.length === 0) {
        console.warn("NEWS UPDATE: no rows matched id", tables.newsRow);
        return NextResponse.json({ ok: false, error: "no row matched" }, { status: 404 });
      }

      return NextResponse.json({ ok: true, status: "news updated", data });
    }

    // Unknown type
    console.warn("UNKNOWN ALERT TYPE:", type);
    return NextResponse.json({ ok: false, error: "unknown alert type" }, { status: 400 });

  } catch (err) {
    console.error("BUNDLED webhook error:", err);
    return NextResponse.json({ ok: false, error: "server error", detail: String(err) }, { status: 500 });
  }
}
