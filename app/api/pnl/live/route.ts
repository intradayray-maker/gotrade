// app/api/pnl/live/route.ts
import { NextResponse } from 'next/server';

const ALPACA_API_KEY = process.env.ALPACA_API_KEY!;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET!;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL ?? 'https://paper-api.alpaca.markets';

if (!ALPACA_API_KEY || !ALPACA_API_SECRET) {
  // Fail fast at boot if keys are missing
  console.warn('[PnlRoute] Missing Alpaca API credentials in environment variables');
}

type AlpacaAccount = {
  equity: string;
  last_equity: string;
  cash: string;
  buying_power: string;
  portfolio_value?: string;
};

export type LivePnlResponse = {
  equity: number;
  lastEquity: number;
  dayPnl: number;
  dayPnlPct: number;
  cash: number;
  buyingPower: number;
  portfolioValue: number;
  timestamp: string;
};

async function fetchAlpacaAccount(): Promise<AlpacaAccount> {
  const res = await fetch(`${ALPACA_BASE_URL}/v2/account`, {
    method: 'GET',
    headers: {
      'APCA-API-KEY-ID': ALPACA_API_KEY,
      'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
      'Content-Type': 'application/json',
    },
    // Avoid Next.js caching for live data
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[PnlRoute] Failed to fetch Alpaca account', res.status, text);
    throw new Error(`Failed to fetch Alpaca account: ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const account = await fetchAlpacaAccount();

    const equity = Number(account.equity ?? 0);
    const lastEquity = Number(account.last_equity ?? 0);
    const cash = Number(account.cash ?? 0);
    const buyingPower = Number(account.buying_power ?? 0);
    const portfolioValue = Number(account.portfolio_value ?? account.equity ?? 0);

    const dayPnl = equity - lastEquity;
    const dayPnlPct = lastEquity !== 0 ? (dayPnl / lastEquity) * 100 : 0;

    const payload: LivePnlResponse = {
      equity,
      lastEquity,
      dayPnl,
      dayPnlPct,
      cash,
      buyingPower,
      portfolioValue,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('[PnlRoute] GET /api/pnl/live error', error);
    return NextResponse.json(
      { error: 'Failed to load live PnL' },
      { status: 500 },
    );
  }
}
