// app/api/equity/from-trades/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAlpacaConfigForUser } from "@/lib/brokers/alpaca/alpacaClient";

export const runtime = "nodejs";

type AlpacaActivity = {
  activity_type: string;
  id: string;
  price: string;
  qty: string;
  side: "buy" | "sell";
  symbol: string;
  transaction_time: string;
};

type NormalizedTrade = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  created_at: string;
};

function normalizeTrade(a: AlpacaActivity): NormalizedTrade {
  return {
    id: a.id,
    symbol: a.symbol,
    side: a.side,
    qty: Number(a.qty),
    price: Number(a.price),
    created_at: a.transaction_time,
  };
}

export async function GET(req: Request) {
  try {
    // auth (same as /api/trades/list)
    const supabase = await createRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ history: [] }, { status: 401 });
    }

    // fetch all FILL activities from Alpaca
    const config = await getAlpacaConfigForUser(user.id);
    const params = new URLSearchParams();
    params.set("activity_types", "FILL");

    const res = await fetch(
      `${config.baseUrl}/v2/account/activities?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "APCA-API-KEY-ID": config.apiKeyId,
          "APCA-API-SECRET-KEY": config.apiSecret,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Equity-from-trades Alpaca error:", res.status, text);
      return NextResponse.json({ history: [] }, { status: 200 });
    }

    const activities = (await res.json()) as AlpacaActivity[];
    const trades: NormalizedTrade[] = activities
      .filter((a) => a.activity_type === "FILL")
      .map(normalizeTrade);

    if (!trades.length) {
      return NextResponse.json({ history: [] }, { status: 200 });
    }

    // sort ascending by created_at
    trades.sort(
      (a: NormalizedTrade, b: NormalizedTrade) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // simulate equity
    let cash = 100000; // starting balance
    const positions: Record<string, number> = {};
    const lastPrice: Record<string, number> = {};

    const history: { created_at: string; equity: number }[] = [];

    for (const t of trades) {
      const price = t.price;
      const qty = t.qty;
      const symbol = t.symbol;
      const side = t.side;

      const created_at = new Date(t.created_at).toISOString();

      if (!positions[symbol]) positions[symbol] = 0;
      lastPrice[symbol] = price;

      if (side === "buy") {
        cash -= price * qty;
        positions[symbol] += qty;
      } else if (side === "sell") {
        cash += price * qty;
        positions[symbol] -= qty;
      }

      let equity = cash;
      for (const sym of Object.keys(positions)) {
        const posQty = positions[sym];
        if (posQty !== 0 && lastPrice[sym] != null) {
          equity += posQty * lastPrice[sym];
        }
      }

      history.push({
        created_at,
        equity: Number(equity.toFixed(2)),
      });
    }

    return NextResponse.json({ history }, { status: 200 });
  } catch (err) {
    console.error("Equity-from-trades fatal error:", err);
    return NextResponse.json({ history: [] }, { status: 200 });
  }
}
