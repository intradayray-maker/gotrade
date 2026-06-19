// lib/data-providers.ts

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getTickerData(ticker: string) {
  const supabase = await createSupabaseServerClient();

  const { data: fundamentals } = await supabase
    .from("fundamentals")
    .select("*")
    .eq("ticker", ticker)
    .single();

  const { data: dividends } = await supabase
    .from("dividends")
    .select("*")
    .eq("ticker", ticker)
    .order("exDate", { ascending: false });

  const { data: prices } = await supabase
    .from("prices")
    .select("*")
    .eq("ticker", ticker)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  return {
    ticker,
    fundamentals,
    dividends,
    prices,
  };
}
