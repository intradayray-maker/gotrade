export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ------------------------------------------------------------
// SAFE RESEND CLIENT
// ------------------------------------------------------------
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY missing — email sending disabled");
}

// ------------------------------------------------------------
// SAFE EMAIL SENDER
// ------------------------------------------------------------
async function sendSimpleAlertEmail(to: string) {
  if (!resend) {
    console.warn("Email skipped — no RESEND_API_KEY");
    return;
  }

  if (!to || !to.includes("@")) {
    console.warn("Invalid email address:", to);
    return;
  }

  try {
    const result = await resend.emails.send({
      from: "GoTrade Alerts <alerts@gotrade.one>",
      to,
      subject: "New Trade Alert",
      html: `
        <p>A new trade signal has been detected.</p>
        <p>Please check your dashboard for details.</p>
      `,
    });

    console.log("EMAIL SENT:", result);
  } catch (err) {
    console.error("EMAIL SEND ERROR:", JSON.stringify(err, null, 2));
  }
}

// -----------------------------
// BOT ROW IDs
// -----------------------------
const EURUSD = {
  tradeTable: "EURUSD_trades_state",
  barTable:   "EURUSD_bar_state",
  newsTable:  "EURUSD_news_state",
  tradeRow: "5726f12d-46d7-4e03-8131-a1febfd7ae42",
  barRow:   "87b8c55f-52c7-4824-9fc7-98febbbdb02d",
  newsRow:  "d1c4f448-a9f9-4938-ac75-14398ee7aa40"
};

const ETH = {
  tradeTable: "ETHUSDT_trades_state",
  barTable:   "ETHUSDT_bar_state",
  newsTable:  "ETHUSDT_news_state",
  tradeRow: "0fee5c83-f233-4487-bc5f-f7e703a14024",
  barRow:   "530ef4a6-e3be-4c19-b34e-1d84062170cb",
  newsRow:  "40d28923-8f43-464f-8147-244d63141587"
};

const RELAX = {
  tradeTable: "SWING_trades_state",
  barTable:   "SWING_bar_state",
  newsTable:  "SWING_news_state",
  tradeRow: "81587010-c8c1-4857-a1e8-f476aa04c439",
  barRow:   "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71",
  newsRow:  "9d5488a8-fefb-4df3-96f7-6347cf1ade87"
};

// -----------------------------
// BOT ROUTER
// -----------------------------
function getBotTables(bot: string | null | undefined) {
  if (!bot) return RELAX;
  const b = String(bot).trim().toUpperCase();
  if (b === "EURUSD") return EURUSD;
  if (b === "ETH" || b === "ETHUSDT") return ETH;
  if (b === "RELAX" || b === "SWING") return RELAX;
  return null;
}

// -----------------------------
// HELPERS
// -----------------------------
function sanitizeString(v: unknown) {
  if (v === null || v === undefined) return null;
  return String(v).replace(/[\u0000-\u001F\u007F]/g, "").trim();
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
// MAIN HANDLER
// -----------------------------
export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const raw = await req.text();
  console.log("RAW WEBHOOK BODY:", raw);

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
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

    // ------------------------------------------------------------
    // TRADE UPDATE
    // ------------------------------------------------------------
    if (["entry_long", "entry_short", "sl", "tp"].includes(type)) {
      if (!isFiniteNumber(body.entry) || !isFiniteNumber(body.stop) || !isFiniteNumber(body.tp)) {
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

      const { data, error } = await supabase
        .from(tables.tradeTable)
        .update(payload)
        .eq("id", tables.tradeRow)
        .select();

      if (error) {
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      // ------------------------------------------------------------
      // EMAIL ONLY FOR RELAX BOT — using stored user_id
      // ------------------------------------------------------------
      const botUpper = String(botKey).toUpperCase();
      const isRelax = botUpper === "RELAX" || botUpper === "SWING";

      if (isRelax) {
        const { data: relaxRow } = await supabase
          .from(tables.tradeTable)
          .select("user_id")
          .eq("id", tables.tradeRow)
          .single();

        if (relaxRow?.user_id) {
          const { data: user } = await supabase.auth.admin.getUserById(relaxRow.user_id);
          const userEmail = user?.user?.email;

          if (userEmail) {
            await sendSimpleAlertEmail(userEmail);
          } else {
            console.warn("RELAX user has no email");
          }
        } else {
          console.warn("RELAX trade row has no user_id");
        }
      }

      return NextResponse.json({ ok: true, status: "trade updated", data });
    }

    // ------------------------------------------------------------
    // BAR UPDATE
    // ------------------------------------------------------------
    if (type === "bar") {
      const payload = {
        ticker: sanitizeString(body.ticker),
        high: isFiniteNumber(body.high) ? Number(body.high) : null,
        low: isFiniteNumber(body.low) ? Number(body.low) : null,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(tables.barTable)
        .update(payload)
        .eq("id", tables.barRow)
        .select();

      if (error) {
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: "bar updated", data });
    }

    // ------------------------------------------------------------
    // NEWS / SWING META UPDATE
    // ------------------------------------------------------------
    if (type === "news" || type === "swing_news" || type === "swing_meta") {
      const payload: any = {
        timestamp: new Date().toISOString()
      };

      if (type === "news") {
        payload.news_today = Boolean(body.news_today);
        payload.news_message = sanitizeString(body.news_message);
        payload.next_news_time = sanitizeString(body.next_news_time);
        payload.news_window_active = Boolean(body.news_window_active);
        payload.news_countdown = isFiniteNumber(body.news_countdown)
          ? Number(body.news_countdown)
          : null;
      }

      if (type === "swing_news" || type === "swing_meta") {
        payload.ticker = sanitizeString(body.ticker);
        payload.entry_window_text = sanitizeString(body.entry_window_text);
        payload.entry_window_percent = isFiniteNumber(body.entry_window_percent)
          ? Number(body.entry_window_percent)
          : null;
        payload.hold_duration_text = sanitizeString(body.hold_duration_text);
        payload.risk_window_note = sanitizeString(body.risk_window_note);
      }

      const { data, error } = await supabase
        .from(tables.newsTable)
        .update(payload)
        .eq("id", tables.newsRow)
        .select();

      if (error) {
        return NextResponse.json({ ok: false, error }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: "news updated", data });
    }

    return NextResponse.json({ ok: false, error: "unknown alert type" }, { status: 400 });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
