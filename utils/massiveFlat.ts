// utils/massiveFlat.ts

import { createClient } from "@supabase/supabase-js";

////////////////////////////////////////////////////////////////////////////////
// SUPABASE CLIENT
////////////////////////////////////////////////////////////////////////////////

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

////////////////////////////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////////////////////////////

export type Fundamental = {
  ticker: string;
  [key: string]: any;
};

export type Dividend = {
  ticker: string;
  [key: string]: any;
};

export type Price = {
  ticker: string;
  [key: string]: any;
};

export type MassivePayload = {
  fundamentals: Record<string, Fundamental>;
  dividends: Record<string, Dividend>;
  prices: Record<string, Price>;
};

////////////////////////////////////////////////////////////////////////////////
// MEMORY CACHE (prevents repeated Edge Function calls)
////////////////////////////////////////////////////////////////////////////////

let CACHE: {
  fundamentals: Fundamental[];
  dividends: Dividend[];
  prices: Price[];
} | null = null;

////////////////////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////////////////////

function normalize<T>(obj: Record<string, T>): T[] {
  if (!obj || typeof obj !== "object") return [];
  return Object.values(obj);
}

////////////////////////////////////////////////////////////////////////////////
// FETCH FROM EDGE FUNCTION
////////////////////////////////////////////////////////////////////////////////

async function loadMassiveData() {
  if (CACHE) return CACHE;

  console.log("📡 [massiveFlat] Fetching data from Edge Function...");

  const { data, error } = await supabase.functions.invoke("update-dividends");

  if (error) {
    console.error("❌ [massiveFlat] Edge Function error:", error);
    return {
      fundamentals: [],
      dividends: [],
      prices: []
    };
  }

  const payload = data as MassivePayload;

  const fundamentals = normalize(payload.fundamentals);
  const dividends = normalize(payload.dividends);
  const prices = normalize(payload.prices);

  CACHE = { fundamentals, dividends, prices };

  console.log("✅ [massiveFlat] Data loaded and normalized");

  return CACHE;
}

////////////////////////////////////////////////////////////////////////////////
// PUBLIC API
////////////////////////////////////////////////////////////////////////////////

export async function getFundamental(ticker: string) {
  const { fundamentals } = await loadMassiveData();
  return fundamentals.find((x) => x.ticker === ticker) || null;
}

export async function getDividend(ticker: string) {
  const { dividends } = await loadMassiveData();
  return dividends.find((x) => x.ticker === ticker) || null;
}

export async function getPrice(ticker: string) {
  const { prices } = await loadMassiveData();
  return prices.find((x) => x.ticker === ticker) || null;
}

export async function getBatchDividendData(tickers: string[]) {
  const { fundamentals, dividends, prices } = await loadMassiveData();

  return tickers.map((t) => ({
    ticker: t,
    fundamentals: fundamentals.find((x) => x.ticker === t) || null,
    dividends: dividends.find((x) => x.ticker === t) || null,
    prices: prices.find((x) => x.ticker === t) || null
  }));
}
