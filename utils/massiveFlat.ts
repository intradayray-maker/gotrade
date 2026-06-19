// utils/massiveFlat.ts

import { createSupabaseServerClient } from "@/utils/supabase/server";

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

////////////////////////////////////////////////////////////////////////////////
// MEMORY CACHE
////////////////////////////////////////////////////////////////////////////////

let CACHE: {
  fundamentals: Fundamental[];
  dividends: Dividend[];
  prices: Price[];
} | null = null;

////////////////////////////////////////////////////////////////////////////////
// LOAD FROM SUPABASE TABLES (LOCAL MODE)
////////////////////////////////////////////////////////////////////////////////

async function loadMassiveData() {
  if (CACHE) return CACHE;

  console.log("📡 [massiveFlat] Loading data from Supabase tables...");

  const supabase = await createSupabaseServerClient();

  const { data: fundamentals } = await supabase
    .from("fundamentals")
    .select("*");

  const { data: dividends } = await supabase
    .from("dividends")
    .select("*");

  const { data: prices } = await supabase
    .from("prices")
    .select("*");

  CACHE = {
    fundamentals: fundamentals ?? [],
    dividends: dividends ?? [],
    prices: prices ?? []
  };

  console.log("✅ [massiveFlat] Local data loaded");

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
