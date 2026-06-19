// lib/brokers/blofin/getPositions.ts

import type
{
 BrokerPosition,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinCredentials,
} from "./blofinClient"

import
{
 blofinClient,
} from "./blofinClient"

type BlofinPosition =
 {
  positionId: string
  instId: string
  instType: string
  marginMode: string
  positionSide: string
  positions: string
  availablePositions: string
  averagePrice: string
  markPrice: string
  leverage: string
  unrealizedPnl?: string
 }

export async function getPositionsBlofin
(
 creds: BlofinCredentials,
): Promise<BrokerPosition[]>
{
 const res =
  await blofinClient.request<BlofinPosition[]>(
   creds,
   "/api/v1/account/positions",
   "GET",
  )

 if (res.code !== "0" || !res.data)
  throw new Error(
   `Blofin getPositions failed: ${res.code} ${res.msg}`,
  )

  return res.data.map((p) =>
  ({
   symbol: p.instId,
   side: Number(p.positions) >= 0
    ? "long"
    : "short",
   qty: Math.abs(Number(p.positions)),
   avgPrice: Number(p.averagePrice),
   unrealizedPnl: p.unrealizedPnl
    ? Number(p.unrealizedPnl)
    : 0,
   leverage: Number(p.leverage ?? 0),
   raw: p,
  }))
}

export async function getPositions(userId: string): Promise<BrokerPosition[]> {
  // TODO: Replace this placeholder with a credential-backed Blofin lookup when the broker link flow is finalized.
  return [
    {
      symbol: "PLACEHOLDER",
      side: "long",
      qty: 0,
      entryPrice: 0,
      unrealizedPnl: 0,
      raw: { userId, note: "TODO: implement Blofin positions fetch" },
    },
  ];
}
