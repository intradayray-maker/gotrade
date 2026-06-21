// ========================================
// FILE: utils/massive.ts
// Massive.com-powered dividend + fundamentals batch
// ========================================

const MASSIVE_BASE_URL = "https://api.massive.com/v1";

export async function getBatchDividendData(tickers: string[]) {
  try {
    const apiKey = process.env.MASSIVE_API_KEY;
    const list = tickers.join(",");

    // 1. FUNDAMENTALS / REFERENCE DATA
    const fundamentalsRes = await fetch(
      `${MASSIVE_BASE_URL}/stocks/reference?tickers=${list}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );
    const fundamentalsJson = await fundamentalsRes.json();
    const fundamentals = fundamentalsJson?.results ?? [];

    // 2. DIVIDENDS / CORPORATE ACTIONS
    const dividendsRes = await fetch(
      `${MASSIVE_BASE_URL}/stocks/dividends?tickers=${list}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );
    const dividendsJson = await dividendsRes.json();
    const dividends = dividendsJson?.results ?? [];

    // 3. BUILD FINAL OBJECTS
    return tickers.map((t) => {
      const f = fundamentals.find((x: any) => x.ticker === t);
      const d = dividends.find((x: any) => x.ticker === t);

      // You can refine these mappings once you see Massive’s exact JSON shape
      const price = f?.close ?? f?.last_price ?? 0;
      const divAmount = d?.amount ?? 0;

      const dividendYield =
        price > 0 ? (divAmount / price) * 100 : 0;

      return {
        ticker: t,
        companyName: f?.name ?? "",
        dividendYield,
        payoutRatio: f?.payout_ratio ?? 0,
        beta: f?.beta ?? 0,
        sector: f?.sector ?? f?.industry ?? "",
        exDividendDate: d?.ex_dividend_date ?? d?.exDate ?? null
      };
    });
  } catch (err) {
    console.error("💥 Massive batch error:", err);
    return [];
  }
}
