// ========================================
// FILE: utils/stocksLocal.ts
// Loads stocks.json from Supabase Storage
// ========================================

import { createClient } from "@supabase/supabase-js";

// ========================================
// Types
// ========================================
export interface Stock {
  ticker: string
  companyName: string
  sector: string
  beta: number
  payoutRatio: number
  exDividendDate: string | null
  dividendYield: number
  price: number
}

let cachedStocks: Stock[] | null = null;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========================================
// Load stocks.json from Supabase Storage
// ========================================
export async function loadStocks(): Promise<Stock[]> {
  if (cachedStocks) return cachedStocks;

  console.log("📥 Loading stocks.json from Supabase…");

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "Gotrade")
    .download("stocks.json");

  if (error) {
    console.error("❌ Failed to load stocks.json:", error);
    return [];
  }

  const text = await data.text();
  const json = JSON.parse(text) as Stock[];

  console.log("📦 Loaded stocks:", json.length);

  cachedStocks = json;
  return json;
}

// ========================================
// Get dividend picks (Finder)
// ========================================
export async function getDividendPicks(): Promise<Stock[]> {
  const stocks = await loadStocks();

  const picks = stocks
    .filter((s: Stock) => s.dividendYield > 0)
    .sort((a: Stock, b: Stock) => b.dividendYield - a.dividendYield);

  console.log("🎯 Dividend picks:", picks.length);

  return picks;
}

// ========================================
// Get a single stock by ticker
// ========================================
export async function getStock(ticker: string): Promise<Stock | null> {
  const stocks = await loadStocks();
  return stocks.find((s: Stock) => s.ticker === ticker) || null;
}
