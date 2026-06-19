// ========================================
// FILE: utils/fmp.ts  (FIXED FOR FMP v4)
// ========================================

export async function getBatchDividendData(tickers: string[]) {
  try {
    const list = tickers.join(",");

    // 1. QUOTES + FUNDAMENTALS (v4)
    const quotesRes = await fetch(
      `https://financialmodelingprep.com/api/v4/stock-full-financials-batch?tickers=${list}&apikey=${process.env.FMP_API_KEY}`
    );
    let quotes = await quotesRes.json();
    console.log("🔥 QUOTES RAW:", quotes);

    // 2. KEY METRICS (v4)
    const metricsRes = await fetch(
      `https://financialmodelingprep.com/api/v4/stock-full-key-metrics-batch?tickers=${list}&apikey=${process.env.FMP_API_KEY}`
    );
    let metrics = await metricsRes.json();
    console.log("🔥 METRICS RAW:", metrics);

    // 3. DIVIDENDS (v4)
    const divRes = await fetch(
      `https://financialmodelingprep.com/api/v4/stock-full-dividends-batch?tickers=${list}&apikey=${process.env.FMP_API_KEY}`
    );
    let dividends = await divRes.json();
    console.log("🔥 DIVIDENDS RAW:", dividends);

    // Normalize
    if (!Array.isArray(quotes)) quotes = [];
    if (!Array.isArray(metrics)) metrics = [];
    if (!Array.isArray(dividends)) dividends = [];

    // Build final objects
    return tickers.map((t) => {
      const q = quotes.find((x: any) => x.symbol === t);
      const m = metrics.find((x: any) => x.symbol === t);
      const d = dividends.find((x: any) => x.symbol === t);

      return {
        ticker: t,
        companyName: q?.companyName ?? "",
        dividendYield: m?.dividendYield ?? 0,
        payoutRatio: m?.payoutRatio ?? 0,
        beta: q?.beta ?? 0,
        sector: q?.sector ?? "",
        exDividendDate: d?.exDividendDate ?? null
      };
    });
  } catch (err) {
    console.error("💥 FMP batch error:", err);
    return [];
  }
}
