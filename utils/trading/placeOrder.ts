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

  // 1. Fetch latest quote
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

  let limitPrice =
    side === "buy" ? quote.ap : quote.bp;

  // 2. If quote is missing, fallback to last trade
  if (!limitPrice || limitPrice <= 0) {
    const tradeRes = await fetch(
      `https://data.alpaca.markets/v2/stocks/${symbol}/trades/latest`,
      {
        headers: {
          "APCA-API-KEY-ID": process.env.ALPACA_KEY!,
          "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET!,
        },
      }
    );

    const tradeJson = await tradeRes.json();
    const lastPrice = tradeJson.trade.p;

    // Add a small buffer so the order fills
    limitPrice =
      side === "buy"
        ? lastPrice * 1.005 // buy slightly above
        : lastPrice * 0.995; // sell slightly below
  }

  // 3. Create valid extended-hours limit order
  const order = await alpaca.createOrder({
    symbol,
    qty,
    side,
    type: "limit",
    limit_price: Number(limitPrice.toFixed(2)),
    time_in_force: "day",
    extended_hours: true,
  });

  return order;
}
