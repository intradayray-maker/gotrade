// app/api/webhook/route.ts
// NODE RUNTIME — updates 3 single-row EURUSD tables

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

// Your actual row IDs
const TRADE_ROW_ID = "5726f12d-46d7-4e03-8131-a1febfd7ae42";
const BAR_ROW_ID   = "87b8c55f-52c7-4824-9fc7-98febbbdb02d";
const NEWS_ROW_ID  = "d1c4f448-a9f9-4938-ac75-14398ee7aa40";

export async function POST(req: Request) {
  try {
    // Parse JSON safely
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[WEBHOOK] Invalid JSON:", err);
      return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      console.warn("[WEBHOOK] Empty or invalid body");
      return NextResponse.json({ ok: false, error: "empty body" }, { status: 400 });
    }

    const type = String(body.type ?? "").toLowerCase();
    console.log("[WEBHOOK] Received:", type, body);

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (type === "trade") {
      const normalizeSide = (s: any) => {
        if (!s) return "flat";
        const v = String(s).toLowerCase();
        if (v === "buy") return "long";
        if (v === "sell") return "short";
        if (["long", "short", "flat"].includes(v)) return v;
        return "flat";
      };

      const payload = {
        side: normalizeSide(body.side),
        entry: Number(body.entry) || null,
        stop: Number(body.stop) || null,
        tp: Number(body.tp) || null,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from("EURUSD_trades_state")
        .update(payload)
        .eq("id", TRADE_ROW_ID);

      if (error) {
        console.error("[WEBHOOK] Trade update error:", error);
        return NextResponse.json({ ok: false, error: "trade update failed" }, { status: 400 });
      }

      console.log("[WEBHOOK] Trade updated:", payload);
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

      const { error } = await supabase
        .from("EURUSD_bar_state")
        .update(payload)
        .eq("id", BAR_ROW_ID);

      if (error) {
        console.error("[WEBHOOK] Bar update error:", error);
        return NextResponse.json({ ok: false, error: "bar update failed" }, { status: 400 });
      }

      console.log("[WEBHOOK] Bar updated:", payload);
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

      const { error } = await supabase
        .from("EURUSD_news_state")
        .update(payload)
        .eq("id", NEWS_ROW_ID);

      if (error) {
        console.error("[WEBHOOK] News update error:", error);
        return NextResponse.json({ ok: false, error: "news update failed" }, { status: 400 });
      }

      console.log("[WEBHOOK] News updated:", payload);
      return NextResponse.json({ ok: true, status: "news updated" });
    }

    // Unknown type
    console.log("[WEBHOOK] Unknown type:", type);
    return NextResponse.json({ ok: true, status: "ignored unknown type" });

  } catch (err) {
    console.error("[WEBHOOK] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "unexpected error" }, { status: 400 });
  }
}
