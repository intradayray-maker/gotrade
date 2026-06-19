import { NextResponse } from 'next/server';

const ALPACA_API_KEY = process.env.ALPACA_API_KEY!;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET!;
const ALPACA_BASE_URL =
  process.env.ALPACA_BASE_URL ?? 'https://paper-api.alpaca.markets';

// Normalize period for Alpaca (Y → A)
function normalizePeriod(period: string) {
  if (period === '1Y') return '1A';
  return period;
}

// Normalize timeframe for Alpaca bars API
function normalizeBarsTimeframe(period: string) {
  if (period === '1A') return '1Day';
  if (period === '6M') return '1Day';
  if (period === '3M') return '1Day';
  if (period === '1M') return '1Day';
  if (period === '1W') return '1Hour';
  return '5Min';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const rawPeriod = searchParams.get('period') ?? '1M';
    const period = normalizePeriod(rawPeriod);

    const timeframe = searchParams.get('timeframe') ?? '1D';
    const benchmark = searchParams.get('benchmark') ?? 'SPY';

    // -----------------------------
    // EQUITY HISTORY
    // -----------------------------
    const equityRes = await fetch(
      `${ALPACA_BASE_URL}/v2/account/portfolio/history?period=${period}&timeframe=${timeframe}`,
      {
        headers: {
          'APCA-API-KEY-ID': ALPACA_API_KEY,
          'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
        },
        cache: 'no-store',
      }
    );

    if (!equityRes.ok) {
      const text = await equityRes.text();
      console.error('[EquityHistoryRoute] EQUITY ERROR:', equityRes.status, text);
      return NextResponse.json(
        { error: 'Failed to load equity history', details: text },
        { status: 500 }
      );
    }

    const equityData = await equityRes.json();

    const history = equityData.equity.map((value: number, i: number) => ({
      timestamp: equityData.timestamp[i] * 1000,
      equity: value,
      profitLoss: equityData.profit_loss[i],
      profitLossPct: equityData.profit_loss_pct[i] * 100,
    }));

    if (!history.length) {
      return NextResponse.json(
        {
          history: [],
          benchmarkHistory: [],
          benchmark,
          period,
          timeframe,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // BENCHMARK FETCH (FIXED)
    // -----------------------------


    // -----------------------------
// BENCHMARK FETCH (FIXED, NO DUPLICATES)
// -----------------------------
const barsTimeframe = normalizeBarsTimeframe(period);

const startISO = new Date(history[0].timestamp).toISOString();
const endISO = new Date(history[history.length - 1].timestamp).toISOString();

let benchmarkHistory: { timestamp: number | null; pct: number }[] = [];

try {
  const benchRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/${benchmark}/bars?timeframe=${barsTimeframe}&start=${startISO}&end=${endISO}&adjustment=raw&limit=1000`,
    {
      headers: {
        "APCA-API-KEY-ID": ALPACA_API_KEY,
        "APCA-API-SECRET-KEY": ALPACA_API_SECRET,
      },
      cache: "no-store",
    }
  );

  if (!benchRes.ok) {
    const text = await benchRes.text();
    console.error("[EquityHistoryRoute] BENCHMARK ERROR:", benchRes.status, text);
    throw new Error("Benchmark fetch failed");
  }

  const benchJson = await benchRes.json();

  if (benchJson?.bars?.length) {
    const firstClose = benchJson.bars[0].c;

    benchmarkHistory = benchJson.bars.map((bar: any, i: number) => ({
      timestamp: history[i]?.timestamp ?? null,
      pct: ((bar.c - firstClose) / firstClose) * 100,
    }));
  }
} catch (err) {
  console.error("[EquityHistoryRoute] BENCHMARK FATAL:", err);
  benchmarkHistory = [];
}


    // -----------------------------
    // RESPONSE
    // -----------------------------
    return NextResponse.json(
      {
        history,
        benchmark,
        benchmarkHistory,
        period,
        timeframe,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[EquityHistoryRoute] Fatal error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
