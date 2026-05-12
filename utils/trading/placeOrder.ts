import Alpaca from "@alpacahq/alpaca-trade-api";

export async function placeOrder(params: {
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  accountType: "master" | "follower";
  userId?: string;
}) {
  const { symbol, side, qty } = params;

  const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY!,
    secretKey: process.env.ALPACA_SECRET!,
    paper: true,
  });

  // ⭐ Fetch quote using Alpaca REST API (reliable)
  const quoteRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`,
    {
      headers: {
        "APCA-API-KEY-ID": process.env.ALPACA_KEY!,
        "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET!,
      },
    }
  );

  const quoteJson = await quoteRes.json();
  const quote = quoteJson.quote;

  const limitPrice =
    side === "buy" ? quote.ap : quote.bp; // ask price / bid price

  // ⭐ Valid extended-hours order
  const order = await alpaca.createOrder({
    symbol,
    qty,
    side,
    type: "limit",
    limit_price: limitPrice,
    time_in_force: "day",
    extended_hours: true,
  });

  return order;
}
