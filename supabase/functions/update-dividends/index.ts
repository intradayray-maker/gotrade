// ========================================
// Supabase Edge Function: update-dividends
// Fetches dividend data for US common stocks
// ========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔧 Environment variables (must match sync-tickers)
const SUPABASE_URL = Deno.env.get("EDGE_SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY")!;
const FINNHUB_API_KEY = Deno.env.get("EDGE_FINNHUB_API_KEY")!;

serve(async () => {
  console.log("🚀 update-dividends started");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Load tickers from Supabase
  console.log("📥 Loading tickers from stocks table…");

  const { data: tickers, error: tickErr } = await supabase
    .from("stocks")
    .select("ticker, price")
    .order("ticker");

  if (tickErr) {
    console.error("❌ Failed to load tickers:", tickErr);
    return new Response("Ticker load error", { status: 500 });
  }

  console.log(`📊 Total tickers loaded: ${tickers.length}`);

  // 🔍 DEBUG: Show first 20 tickers to confirm clean table
  console.log("🔍 First 20 tickers:", tickers.slice(0, 20).map(t => t.ticker));

  // 2. Loop through tickers
  for (const row of tickers) {
    const { ticker, price } = row;

    console.log(`➡️ Fetching dividend for ${ticker}`);

    const url = `https://finnhub.io/api/v1/stock/dividend?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!Array.isArray(json) || json.length === 0) {
      console.log(`   ⚠️ No dividend data for ${ticker}`);
      continue;
    }

    const d = json[0];

    const amount = d.amount ?? 0;
    const frequency = d.frequency ?? 1;
    const annual = amount * frequency;
    const yieldPct = price > 0 ? (annual / price) * 100 : 0;

    // 3. Save to dividends table
    const { error: upErr } = await supabase
      .from("dividends")
      .upsert({
        ticker,
        dividend_yield: yieldPct,
        annual_dividend: annual,
        ex_dividend_date: d.exDate ?? null,
        payment_date: d.payDate ?? null,
        updated_at: new Date().toISOString()
      });

    if (upErr) {
      console.error(`❌ Upsert error for ${ticker}:`, upErr);
    } else {
      console.log(`   ✔ Saved ${ticker}`);
    }

    // Finnhub free tier: 1 req/sec
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("✅ Dividend update complete!");
  return new Response("Dividend update complete");
});
