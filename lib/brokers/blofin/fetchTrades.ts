// lib/brokers/blofin/fetchTrades.ts

import type
{
 BrokerTrade,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinCredentials,
} from "./blofinClient"

/**
 * Blofin ALGO / positions-history can be adapted here once
 * you decide which endpoint represents "trades" for the UI.
 *
 * For now, return an empty list to satisfy the contract
 * without guessing an unsupported endpoint.
 */
export async function fetchTradesBlofin
(
 _creds: BlofinCredentials,
): Promise<BrokerTrade[]>
{
 return []
}

export async function fetchTradesForUser(userId: string): Promise<BrokerTrade[]> {
  // TODO: Replace this placeholder with Blofin trade history when the endpoint is defined.
  return [
    {
      id: `blofin-trade-${userId}`,
      symbol: "PLACEHOLDER",
      side: "buy",
      qty: 0,
      price: 0,
      createdAt: new Date(0).toISOString(),
      raw: { userId, note: "TODO: implement Blofin trade fetch" },
    },
  ];
}
