// ========================================
// FILE: scripts/updateDividends.ts
// Daily Dividend Updater (Finnhub)
// ========================================

require("dotenv").config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FINNHUB = "https://finnhub.io/api/v1";
const finnhubKey = process.env.FINNHUB_API_KEY!;

// ========================================
// Fetch all tickers from Supabase
// ========================================
async function loadTickers() {
  const { data, error } = await supabase
    .from("stocks")
    .select("ticker, price");

  if (error) throw error;
  return data;
}

// ========================================
// Fetch dividend info for one ticker
// ========================================
async function fetchDividend(ticker: string) {
  const url = `${FINNHUB}/stock/dividend?symbol=${ticker}&token=${finnhubKey}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!Array.isArray(json) || json.length === 0) return null;

  const d = json[0];

  return {
    dividend: d.amount ?? 0,
    exDate: d.exDate ?? null,
    payDate: d.payDate ?? null,
    frequency: d.frequency ?? 1
  };
}

// ========================================
// Upsert into Supabase
// ========================================
async function saveDividend(
  ticker: string,
  price: number,
  d: any
) {
  const annual = d.dividend * d.frequency;
  const yieldPct = price > 0 ? (annual / price) * 100 : 0;

  const { error } = await supabase
    .from("dividends")
    .upsert({
      ticker,
      dividend_yield: yieldPct,
      annual_dividend: annual,
      ex_dividend_date: d.exDate,
      payment_date: d.payDate,
      updated_at: new Date().toISOString()
    });

  if (error) console.error("❌ Upsert error:", ticker, error);
}

// ========================================
// MAIN
// ========================================
async function run() {
  console.log("📥 Loading tickers…");

  const tickers = await loadTickers();

  console.log("📊 Total tickers:", tickers.length);

  for (const row of tickers) {
    const { ticker, price } = row;

    console.log("➡️ Fetching:", ticker);

    const d = await fetchDividend(ticker);

    if (d) {
      await saveDividend(ticker, price, d);
      console.log("   ✔ Saved");
    } else {
      console.log("   ⚠️ No dividend data");
    }

    await new Promise((r) => setTimeout(r, 200)); // 5 req/sec
  }

  console.log("✅ Dividend update complete!");
}

run();
