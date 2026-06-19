import type { BrokerBalance } from "@/lib/brokers/brokerTypes";
import { getAlpacaAccount } from "@/lib/brokers/alpaca/alpacaClient";

export async function getBalances(userId: string): Promise<BrokerBalance[]> {
  // TODO: Replace this derived balance view with a direct Alpaca balances source if needed.
  const account = await getAlpacaAccount(userId);
  const raw = account as Record<string, unknown>;

  return [
    {
      currency: "USD",
      total: Number(raw.equity ?? raw.portfolio_value ?? 0),
      available: Number(raw.buying_power ?? raw.cash ?? 0),
      locked: Number(raw.regt_buying_power ?? 0),
      raw: account,
    },
  ];
}
