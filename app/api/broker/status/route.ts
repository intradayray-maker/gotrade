// app/api/broker/status/route.ts
import { NextResponse } from 'next/server';

const ALPACA_API_KEY = process.env.ALPACA_API_KEY!;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET!;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL ?? 'https://paper-api.alpaca.markets';

export async function GET() {
  try {
    const res = await fetch(`${ALPACA_BASE_URL}/v2/account`, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[BrokerStatusRoute] Error', res.status, text);
      return NextResponse.json(
        { error: 'Failed to load broker status', status: 'disconnected' },
        { status: 500 }
      );
    }

    const acct = await res.json();

    return NextResponse.json(
      {
        status: acct.status, // ACTIVE, ACCOUNT_BLOCKED, etc.
        tradeBlocked: acct.trade_blocked,
        accountBlocked: acct.account_blocked,
        buyingPower: Number(acct.buying_power),
        equity: Number(acct.equity),
        cash: Number(acct.cash),
        patternDayTrader: acct.pattern_day_trader,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[BrokerStatusRoute] Fatal error:', err);
    return NextResponse.json(
      { error: 'Unexpected error', status: 'disconnected' },
      { status: 500 }
    );
  }
}
