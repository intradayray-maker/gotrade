// app/api/trade/route.ts

import { NextResponse } from "next/server";
import {
  latestTrade,
  latestBar,
  setLatestTrade,
  setLatestBar,
  TradeData,
  tradeVersion,
} from "./store";

// Production-safe webhook handling
const WEBHOOK_SECRET = process.env.TRADINGVIEW_WEBHOOK_SECRET ?? "";
const DEDUPE_TTL_MS = Number(process.env.DEDUPE_TTL_MS ?? 5 * 60 * 1000); // 5m
const MIN_TRADE_INTERVAL_MS = Number(process.env.MIN_TRADE_INTERVAL_MS ?? 10 * 1000); // 10s
const MAX_TIMESTAMP_SKEW_MS = Number(process.env.MAX_TIMESTAMP_SKEW_MS ?? 2 * 60 * 1000); // 2m

// Persist dedupe maps across lambda invocations when possible
declare global {
  var __gotrade_dedupe: Map<string, number> | undefined;
  var __gotrade_last: Map<string, { side: string; ts: number }> | undefined;
}

if (!global.__gotrade_dedupe) global.__gotrade_dedupe = new Map();
if (!global.__gotrade_last) global.__gotrade_last = new Map();

const dedupeMap = global.__gotrade_dedupe;
const lastMap = global.__gotrade_last;

function nowMs() {
  return Date.now();
}

function getIP(headers: Headers) {
  const xfwd = headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

function maskSecret(v: string | null) {
  if (!v) return "none";
  return "***";
}

export async function POST(req: Request) {
  try {
    const instanceId = Math.random().toString(36).slice(2, 9);
    const headers = req.headers;
    const ua = headers.get("user-agent") ?? "unknown";
    const ip = getIP(headers);
    const receivedAt = new Date().toISOString();

    console.info(`[Webhook:${instanceId}] ${receivedAt} IP=${ip} UA="${ua}"`);

    // Strict secret enforcement
    if (!WEBHOOK_SECRET) {
      console.error(`[Webhook:${instanceId}] Missing WEBHOOK_SECRET on server. Rejecting all requests.`);
      return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
    }

    const headerSecret = headers.get("x-webhook-secret") ?? headers.get("x-gotrade-secret");
    if (!headerSecret || headerSecret !== WEBHOOK_SECRET) {
      console.warn(`[Webhook:${instanceId}] Unauthorized. IP=${ip} UA="${ua}" Secret=${maskSecret(headerSecret)}`);
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
    }

    // Content-type safety
    const contentType = headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.warn(`[Webhook:${instanceId}] Invalid content-type from IP=${ip} UA="${ua}" content-type=${contentType}`);
      return NextResponse.json({ error: "invalid content-type" }, { status: 400 });
    }

    const body = await req.json();
    console.info(`[Webhook:${instanceId}] BODY: ${JSON.stringify(body)}`);

    // BAR UPDATE (same behavior as before)
    if (body.type === "bar") {
      const { high, low } = body;

      if (typeof high !== "number" || typeof low !== "number") {
        return NextResponse.json({ error: "Invalid bar data" }, { status: 400 });
      }

      setLatestBar({
        high,
        low,
        updated_at: new Date().toISOString(),

        news_today: Boolean(body.news_today),
        news_message: body.news_message ?? "",
        next_news_time: body.next_news_time ?? "None",

        news_window_active: Boolean(body.news_window_active),
        news_countdown: Number(body.news_countdown ?? 0),
      });

      console.info(`[Webhook:${instanceId}] BAR stored for IP=${ip}`);
      return NextResponse.json({ status: "bar stored" });
    }

    // Ignore other non-trade types
    if (body.type !== "trade") {
      console.info(`[Webhook:${instanceId}] Ignored non-trade type=${body.type}`);
      return NextResponse.json({ status: "ignored non-trade" });
    }

    // Basic required fields
    if (typeof body.ticker !== "string" || !body.ticker.trim()) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
    }

    const sideRaw = String(body.side ?? "").toLowerCase();
    if (!["long", "short", "flat"].includes(sideRaw)) {
      return NextResponse.json({ error: "Invalid side" }, { status: 400 });
    }

    // Timestamp required for dedupe/replay protection
    if (!body.timestamp || typeof body.timestamp !== "string") {
      return NextResponse.json({ error: "Missing timestamp" }, { status: 400 });
    }

    const ts = Date.parse(body.timestamp);
    if (isNaN(ts)) {
      return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
    }

    // Prevent large clock skew or future timestamps
    const skew = Math.abs(nowMs() - ts);
    if (skew > MAX_TIMESTAMP_SKEW_MS) {
      console.warn(`[Webhook:${instanceId}] Timestamp skew too large IP=${ip} ts=${body.timestamp} skewMs=${skew}`);
      return NextResponse.json({ error: "timestamp skew too large" }, { status: 400 });
    }

    // Validate numeric fields only for entry-side trades
    let entryVal = 0,
      stopVal = 0,
      tpVal = 0;
    if (sideRaw === "long" || sideRaw === "short") {
      if (typeof body.entry !== "number" || !Number.isFinite(body.entry)) {
        return NextResponse.json({ error: "Invalid entry value" }, { status: 400 });
      }
      entryVal = body.entry;
      stopVal = typeof body.stop === "number" && Number.isFinite(body.stop) ? body.stop : 0;
      tpVal = typeof body.tp === "number" && Number.isFinite(body.tp) ? body.tp : 0;
    }

    const trade: TradeData = {
      ticker: body.ticker.trim(),
      side: sideRaw,
      entry: entryVal,
      stop: stopVal,
      tp: tpVal,
      timestamp: String(body.timestamp ?? ""),

      news_today: Boolean(body.news_today),
      news_message: body.news_message ?? "",
      next_news_time: body.next_news_time ?? "None",

      news_window_active: Boolean(body.news_window_active),
      news_countdown: Number(body.news_countdown ?? 0),
    };

    // Dedupe key includes side/ticker/timestamp/entry to avoid replays
    const dedupeKey = `${body.type}|${trade.side}|${trade.ticker}|${trade.timestamp}|${trade.entry}`;

    // Clean old dedupe entries
    const cutoff = nowMs() - DEDUPE_TTL_MS;
    for (const [k, v] of dedupeMap) {
      if (v < cutoff) dedupeMap.delete(k);
    }

    if (dedupeMap.has(dedupeKey)) {
      console.info(`[Webhook:${instanceId}] Duplicate webhook rejected dedupeKey=${dedupeKey} IP=${ip}`);
      return NextResponse.json({ status: "duplicate ignored" }, { status: 409 });
    }

    // Anti-flip: minimum interval per ticker
    const last = lastMap.get(trade.ticker);
    if (last) {
      const delta = Math.abs(ts - last.ts);
      if (delta < MIN_TRADE_INTERVAL_MS) {
        console.info(`[Webhook:${instanceId}] Rapid flip rejected for ${trade.ticker} IP=${ip} lastSide=${last.side} newSide=${trade.side} deltaMs=${delta}`);
        return NextResponse.json({ error: "rapid flip detected" }, { status: 429 });
      }
      if (last.side === trade.side && delta < DEDUPE_TTL_MS) {
        console.info(`[Webhook:${instanceId}] Repeated same-side trade rejected for ${trade.ticker} IP=${ip}`);
        return NextResponse.json({ status: "repeated same-side ignored" }, { status: 409 });
      }
    }

    // Accept and store
    dedupeMap.set(dedupeKey, nowMs());
    lastMap.set(trade.ticker, { side: trade.side, ts });

    setLatestTrade(trade);

    console.info(`[Webhook:${instanceId}] ACCEPTED IP=${ip} UA="${ua}" body=${JSON.stringify(body)} Secret=${maskSecret(headerSecret)}`);

    return NextResponse.json({ status: "trade stored" });
  } catch (err) {
    console.error("[Webhook] Error parsing request", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    trade: latestTrade,
    bar: latestBar,
    version: tradeVersion,
  });
}
