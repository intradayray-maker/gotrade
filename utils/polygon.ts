// ========================================
// FILE: utils/polygon.ts
// Correct Polygon-powered Dividend Finder
// With fallback fundamentals resolution
// ========================================

const POLYGON = "https://api.polygon.io";

export async function getBatchDividendData(tickers: string[]) {
  const apiKey = process.env.POLYGON_API_KEY;

  // ----------------------------------------
  // FUNDAMENTALS FETCHER (with fallbacks)
  // ----------------------------------------
  async function fetchFundamentals(ticker: string) {
    // 1. Direct lookup
    let res = await fetch(
      `${POLYGON}/v3/reference/tickers/${ticker}?apiKey=${apiKey}`
    );
    let json = await res.json();
    if (json?.results) return json.results;

    // 2. Search fallback
    res = await fetch(
      `${POLYGON}/v3/reference/tickers?search=${ticker}&active=true&market=stocks&apiKey=${apiKey}`
    );
    json = await res.json();
    if (json?.results?.length > 0) return json.results[0];

    // 3. Exact match fallback
    res = await fetch(
      `${POLYGON}/v3/reference/tickers?ticker=${ticker}&apiKey=${apiKey}`
    );
    json = await res.json();
    if (json?.results?.length > 0) return json.results[0];

    return null;
  }

  // ----------------------------------------
  // DIVIDENDS FETCHER
  // ----------------------------------------
  async function fetchDividends(ticker: string) {
    const res = await fetch(
      `${POLYGON}/v3/reference/dividends?ticker=${ticker}&limit=1&apiKey=${apiKey}`
    );
    const json = await res.json();
    return json?.results?.[0] ?? null;
  }

  // ----------------------------------------
  // PRICE FETCHER (previous close)
  // ----------------------------------------
  async function fetchPrice(ticker: string) {
    const res = await fetch(
      `${POLYGON}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`
    );
    const json = await res.json();
    return json?.results?.[0]?.c ?? 0; // close price
  }

  // ----------------------------------------
  // PROCESS EACH TICKER IN PARALLEL
  // ----------------------------------------
  const results = [];

  for (const t of tickers) {
    const [f, d, price] = await Promise.all([
      fetchFundamentals(t),
      fetchDividends(t),
      fetchPrice(t)
    ]);

    const dividendAmount = d?.cash_amount ?? 0;
    const dividendYield = price > 0 ? (dividendAmount / price) * 100 : 0;

    results.push({
      ticker: t,
      companyName: f?.name ?? "",
      dividendYield,
      payoutRatio: f?.payout_ratio ?? 0,
      beta: f?.beta ?? 0,
      sector: f?.sic_description ?? "",
      exDividendDate: d?.ex_dividend_date ?? null
    });
  }

  return results;
}
