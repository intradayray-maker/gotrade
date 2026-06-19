// app/api/positions/live/route.ts
import { NextResponse } from 'next/server';

const ALPACA_API_KEY = process.env.ALPACA_API_KEY!;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET!;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL ?? 'https://paper-api.alpaca.markets';

export async function GET() {
  try {
    const res = await fetch(`${ALPACA_BASE_URL}/v2/positions`, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[PositionsRoute] Error', res.status, text);
      return NextResponse.json({ error: 'Failed to load positions' }, { status: 500 });
    }

    const positions = await res.json();

    return NextResponse.json(
      {
        positions: positions.map((p: any) => ({
          symbol: p.symbol,
          qty: Number(p.qty),
          avgEntry: Number(p.avg_entry_price),
          marketPrice: Number(p.current_price),
          unrealizedPnl: Number(p.unrealized_pl),
          unrealizedPnlPct: Number(p.unrealized_plpc) * 100,
        })),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[PositionsRoute] Unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
