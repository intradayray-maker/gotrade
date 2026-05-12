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

  const order = await alpaca.createOrder({
    symbol,
    qty,
    side,
    type: "market",
    time_in_force: "gtc",
  });

  return order;
}
