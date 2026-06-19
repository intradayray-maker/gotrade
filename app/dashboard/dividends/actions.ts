"use server";

import { getFundamental, getDividend, getPrice } from "@/utils/massiveFlat";

export async function runFinderSearch(tickers: string[]) {
  try {
    const results = await Promise.all(
      tickers.map(async (t) => ({
        ticker: t,
        fundamentals: await getFundamental(t),
        dividends: await getDividend(t),
        prices: await getPrice(t),
      }))
    );

    return results;
  } catch (err) {
    console.error("runFinderSearch error:", err);
    return [];
  }
}
