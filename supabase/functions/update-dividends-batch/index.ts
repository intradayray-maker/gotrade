// ========================================
// Supabase Edge Function: update-dividends-batch
// Processes dividends in batches to avoid timeouts
// ========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Env vars (must match sync-tickers)
const SUPABASE_URL = Deno.env.get("EDGE_SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY")!;
const FINNHUB_API_KEY = Deno.env.get("EDGE_FINNHUB_API_KEY")!;

const BATCH_SIZE = 200; // safe for 60s runtime

serve(async () => {
  console.log("🚀 Batch dividend updater started");

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // 1. Load progress
  const { data: progress } = await supabase
    .from("dividend_progress")
    .select("last_index")
    .eq("id", 1)
    .single();

  const lastIndex = progress?.last_index ?? 0;

  console.log("📍 Starting at index:", lastIndex);

  // 2. Load tickers
  const { data: tickers, error: tickErr } = await supabase
    .from("stocks")
    .select("ticker, price")
    .order("ticker");

  if (tickErr) {
    console.error("❌ Failed to load tickers:", tickErr);
    return new Response("Ticker load error", { status: 500 });
  }

  console.log(`📊 Total tickers: ${tickers.length}`);

  // 3. Slice batch
  const batch = tickers.slice(lastIndex, lastIndex + BATCH_SIZE);

  console.log(`📦 Processing batch of ${batch.length} tickers`);

  // 4. Process each ticker
  for (const row of batch) {
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

  // 5. Update progress
  const newIndex = lastIndex + BATCH_SIZE;

  await supabase
    .from("dividend_progress")
    .upsert({
      id: 1,
      last_index: newIndex >= tickers.length ? 0 : newIndex,
      updated_at: new Date().toISOString()
    });

  console.log("📍 Updated progress to:", newIndex);

  console.log("✅ Batch complete");
  return new Response("Batch complete");
});
