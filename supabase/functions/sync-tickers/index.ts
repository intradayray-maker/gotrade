// ========================================
// Supabase Edge Function: sync-tickers
// Fetches all US stock tickers from Finnhub
// Populates the `stocks` table (clean US-only)
// ========================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// MUST MATCH update-dividends env names
const SUPABASE_URL = Deno.env.get("EDGE_SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY")!;
const FINNHUB_API_KEY = Deno.env.get("EDGE_FINNHUB_API_KEY")!;

// Debug logs
console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SERVICE ROLE KEY starts with:", SERVICE_ROLE.slice(0, 8));
console.log("FINNHUB KEY starts with:", FINNHUB_API_KEY.slice(0, 4));

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

serve(async () => {
  console.log("🔄 Syncing tickers…");

  // 1. Fetch all US symbols from Finnhub
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`
  );

  const allSymbols = await res.json();

  if (!Array.isArray(allSymbols)) {
    console.error("❌ Finnhub returned invalid data:", allSymbols);
    return new Response("Finnhub error", { status: 500 });
  }

  console.log(`📥 Finnhub returned ${allSymbols.length} symbols`);

  // 2. Filter to ONLY real US-listed stocks (NASDAQ, NYSE, AMEX)
  const commonStocks = allSymbols.filter((s: any) => {
    const sym = s.symbol;

    if (!sym) return false;

    // Correct MIC codes for US exchanges
    if (!["XNAS", "XNYS", "XASE"].includes(s.mic)) return false;

    // Remove ETFs
    if (s.type === "ETF") return false;

    // Remove ADRs
    if (s.type === "ADR") return false;

    // Remove foreign tickers (F = foreign, Y = ADR, Q = bankrupt)
    if (sym.endsWith("F")) return false;
    if (sym.endsWith("Y")) return false;
    if (sym.endsWith("Q")) return false;

    // Remove warrants, units, rights, preferred
    if (sym.endsWith("W")) return false;
    if (sym.endsWith("U")) return false;
    if (sym.endsWith("P")) return false;
    if (sym.endsWith("R")) return false;

    // Remove weird tickers like BRK.B
    if (sym.includes(".")) return false;

    return true;
  });

  console.log(`📊 Clean US stocks found: ${commonStocks.length}`);

  // 3. Get existing tickers from DB
  const { data: existing } = await supabase
    .from("stocks")
    .select("ticker");

  const existingSet = new Set(existing?.map((x) => x.ticker));
  const incomingSet = new Set(commonStocks.map((s: any) => s.symbol));

  // 4. Build upsert payload
  const upsertPayload = commonStocks.map((s: any) => ({
    ticker: s.symbol,
    price: 0,
    updated_at: new Date().toISOString()
  }));

  console.log("📦 Upserting tickers…");

  // Insert in batches of 500
  const batchSize = 500;
  for (let i = 0; i < upsertPayload.length; i += batchSize) {
    const batch = upsertPayload.slice(i, i + batchSize);

    const { error } = await supabase.from("stocks").upsert(batch);

    if (error) {
      console.error("❌ Batch insert error:", error);
      return new Response("Insert error", { status: 500 });
    }

    console.log(`   ✔ Inserted batch ${i / batchSize + 1}`);
  }

  // 5. Hard delete tickers that no longer exist
  const toDelete = [...existingSet].filter((t) => !incomingSet.has(t));

  if (toDelete.length > 0) {
    console.log(`🗑 Removing delisted tickers: ${toDelete.length}`);
    await supabase.from("stocks").delete().in("ticker", toDelete);
  }

  console.log("✅ Ticker sync complete!");
  return new Response("Ticker sync complete!", { status: 200 });
});
