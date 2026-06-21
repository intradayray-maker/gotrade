// ========================================
// FILE: scripts/buildStocks.ts
// HYBRID BUILDER (Polygon + Massive)
// ========================================

// Load .env.local
require("dotenv").config({ path: ".env.local" });

console.log("🔧 ENV CHECK:");
console.log("  SUPABASE_URL           =", process.env.SUPABASE_URL);
console.log("  SUPABASE_SERVICE_ROLE  =", process.env.SUPABASE_SERVICE_ROLE_KEY ? "[SET]" : "[MISSING]");
console.log("  SUPABASE_BUCKET        =", process.env.SUPABASE_BUCKET);
console.log("  POLYGON_API_KEY        =", process.env.POLYGON_API_KEY ? "[SET]" : "[MISSING]");
console.log("  MASSIVE_API_KEY        =", process.env.MASSIVE_API_KEY ? "[SET]" : "[MISSING]");

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POLYGON = "https://api.polygon.io";
const polygonKey = process.env.POLYGON_API_KEY!;
const massiveKey = process.env.MASSIVE_API_KEY!;

// ========================================
// Types
// ========================================
interface PolygonFundamental {
  ticker: string
  name: string
  sic_description: string
  beta: number
  payout_ratio: number
}

interface PolygonPrice {
  T: string
  c: number
}

interface MassiveDividend {
  ticker: string
  dividendYield: number
  dividendAmount: number
  dividendFrequency: string
  exDividendDate: string | null
  payoutRatio: number
}

interface FinalStock {
  ticker: string
  companyName: string
  sector: string
  beta: number
  payoutRatio: number
  exDividendDate: string | null
  dividendYield: number
  dividendAmount: number
  dividendFrequency: string
  price: number
}

// ========================================
// 1) Fetch ALL fundamentals (Polygon bulk)
// ========================================
async function fetchFundamentals(): Promise<PolygonFundamental[]> {
  console.log("📥 Fetching fundamentals (Polygon)…");

  const url = `${POLYGON}/v3/reference/tickers?market=stocks&active=true&limit=1000&apiKey=${polygonKey}`;
  const res = await fetch(url);
  const json = await res.json();

  console.log("📊 Fundamentals:", json.results?.length ?? 0);
  return json.results ?? [];
}

// ========================================
// 2) Fetch ALL prices (Polygon bulk)
// ========================================
async function fetchPrices(): Promise<PolygonPrice[]> {
  console.log("📥 Fetching prices (Polygon)…");

  const d = new Date();
  d.setDate(d.getDate() - 1);
  const dateStr = d.toISOString().split("T")[0];

  const url = `${POLYGON}/v2/aggs/grouped/locale/us/market/stocks/${dateStr}?adjusted=true&apiKey=${polygonKey}`;
  const res = await fetch(url);
  const json = await res.json();

  console.log("📊 Prices:", json.results?.length ?? 0);
  return json.results ?? [];
}

// ========================================
// 3) Fetch dividends (Massive batch)
// ========================================
async function fetchMassiveDividends(tickers: string[]): Promise<MassiveDividend[]> {
  console.log("📥 Fetching dividends (Massive)…");

  const url = `https://api.massive.app/stocks/dividends`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": massiveKey
    },
    body: JSON.stringify({
      symbols: tickers
    })
  });

  const text = await res.text();
  console.log("🔍 Massive raw response:", text);

  try {
    const json = JSON.parse(text);
    console.log("📊 Massive dividends parsed:", Array.isArray(json) ? json.length : json);
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error("❌ Failed to parse Massive JSON:", err);
    return [];
  }
}

// ========================================
// Merge Polygon + Massive
// ========================================
function mergeData(
  fundamentals: PolygonFundamental[],
  prices: PolygonPrice[],
  dividends: MassiveDividend[]
): FinalStock[] {
  console.log("🔗 Merging datasets…");

  const priceMap = new Map<string, number>();
  for (const p of prices) priceMap.set(p.T, p.c);

  const divMap = new Map<string, MassiveDividend>();
  for (const d of dividends) divMap.set(d.ticker, d);

  const output: FinalStock[] = fundamentals.map((f: PolygonFundamental) => {
    const ticker = f.ticker;

    const price = priceMap.get(ticker) ?? 0;
    const d = divMap.get(ticker);

    return {
      ticker,
      companyName: f.name ?? "",
      sector: f.sic_description ?? "",
      beta: f.beta ?? 0,
      payoutRatio: d?.payoutRatio ?? 0,
      exDividendDate: d?.exDividendDate ?? null,
      dividendYield: d?.dividendYield ?? 0,
      dividendAmount: d?.dividendAmount ?? 0,
      dividendFrequency: d?.dividendFrequency ?? "",
      price
    };
  });

  console.log("📦 Final merged count:", output.length);
  return output;
}

// ========================================
// Upload to Supabase
// ========================================
async function uploadToSupabase(data: FinalStock[]) {
  console.log("🚀 Uploading stocks.json…");

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload("stocks.json", JSON.stringify(data), {
      contentType: "application/json",
      upsert: true
    });

  console.log("🧾 UPLOAD ERROR:", error ?? "none");
  if (!error) console.log("✅ Upload complete!");
}

// ========================================
// MAIN
// ========================================
async function build() {
  try {
    const fundamentals = await fetchFundamentals();
    const prices = await fetchPrices();

    const tickers = fundamentals.map((f) => f.ticker);
    const dividends = await fetchMassiveDividends(tickers);

    const merged = mergeData(fundamentals, prices, dividends);

    await uploadToSupabase(merged);
  } catch (err) {
    console.error("💥 BUILD FAILED:", err);
  }
}

build();


// test