// app/api/webhook/route.ts
// NODE RUNTIME — stable, no waitUntil, no edge quirks

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const ROW_ID = "65f3ad34-2fd0-4dab-91c2-80fc676198e9";

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

    // Fetch existing row
    const { data: existing, error: fetchError } = await supabase
      .from("trade_state")
      .select("*")
      .eq("id", ROW_ID)
      .single();

    if (fetchError) {
      console.warn("[WEBHOOK] Fetch warning:", fetchError);
    }

    // Start payload from existing row to avoid resets
    const payload: any = existing ? { ...existing } : { id: ROW_ID };

    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);

    const normalizeSide = (s: any) => {
      if (!s) return undefined;
      const v = String(s).toLowerCase();
      if (v === "buy") return "long";
      if (v === "sell") return "short";
      if (v === "long" || v === "short" || v === "flat") return v;
      return undefined;
    };

    // -----------------------------
    // TRADE UPDATE
    // -----------------------------
    if (type === "trade") {
      console.log("[WEBHOOK] Processing TRADE");

      const mapped = normalizeSide(body.side);
      if (mapped) payload.side = mapped;

      if (has("ticker") && typeof body.ticker === "string") {
        payload.ticker = body.ticker.trim();
      }

      if (has("entry")) {
        const v = Number(body.entry);
        if (Number.isFinite(v)) payload.entry = v;
      }

      if (has("stop")) {
        const v = Number(body.stop);
        if (Number.isFinite(v)) payload.stop = v;
      }

      if (has("tp")) {
        const v = Number(body.tp);
        if (Number.isFinite(v)) payload.tp = v;
      }

      // Optional news fields
      if (has("news_today")) payload.news_today = Boolean(body.news_today);
      if (has("news_message")) payload.news_message = body.news_message;
      if (has("next_news_time")) payload.next_news_time = body.next_news_time;
      if (has("news_window_active")) payload.news_window_active = Boolean(body.news_window_active);
      if (has("news_countdown")) {
        const v = Number(body.news_countdown);
        if (Number.isFinite(v)) payload.news_countdown = v;
      }

      payload.timestamp = new Date().toISOString();

      // Write to Supabase
      const { error: updateError } = await supabase
        .from("trade_state")
        .update(payload)
        .eq("id", ROW_ID);

      if (updateError) {
        console.error("[WEBHOOK] Trade update error:", updateError);
      } else {
        console.log("[WEBHOOK] Trade updated");
      }

      return NextResponse.json({ ok: true, status: "trade processed" });
    }

    // -----------------------------
    // BAR UPDATE
    // -----------------------------
    if (type === "bar") {
      console.log("[WEBHOOK] Processing BAR");

      const currentSide = existing?.side ?? "flat";

      // Ignore bar updates during active trades
      if (currentSide !== "flat") {
        console.log("[WEBHOOK] BAR ignored — active position:", currentSide);
        return NextResponse.json({ ok: true, status: "bar ignored" });
      }

      if (has("high")) {
        const v = Number(body.high);
        if (Number.isFinite(v)) payload.high = v;
      }

      if (has("low")) {
        const v = Number(body.low);
        if (Number.isFinite(v)) payload.low = v;
      }

      // Optional news fields
      if (has("news_today")) payload.news_today = Boolean(body.news_today);
      if (has("news_message")) payload.news_message = body.news_message;
      if (has("next_news_time")) payload.next_news_time = body.next_news_time;
      if (has("news_window_active")) payload.news_window_active = Boolean(body.news_window_active);
      if (has("news_countdown")) {
        const v = Number(body.news_countdown);
        if (Number.isFinite(v)) payload.news_countdown = v;
      }

      payload.timestamp = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("trade_state")
        .update(payload)
        .eq("id", ROW_ID);

      if (updateError) {
        console.error("[WEBHOOK] Bar update error:", updateError);
      } else {
        console.log("[WEBHOOK] Bar updated");
      }

      return NextResponse.json({ ok: true, status: "bar processed" });
    }

    // Unknown type
    console.log("[WEBHOOK] Unknown type:", type);
    return NextResponse.json({ ok: true, status: "ignored unknown type" });

  } catch (err) {
    console.error("[WEBHOOK] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "unexpected error" }, { status: 400 });
  }
}
