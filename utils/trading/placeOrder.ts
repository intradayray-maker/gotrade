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

  // ⭐ Correct quote API for your SDK
  const quote = await alpaca.getLatestQuoteV2(symbol);

  const limitPrice =
    side === "buy" ? quote.AskPrice : quote.BidPrice;

  const order = await alpaca.createOrder({
    symbol,
    qty,
    side,
    type: "limit",          // required for extended hours
    limit_price: limitPrice,
    time_in_force: "day",   // required for extended hours
    extended_hours: true,
  });

  return order;
}
