// lib/brokers/blofin/getBalances.ts

import type
{
 BrokerBalance,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinCredentials,
} from "./blofinClient"

import
{
 blofinClient,
} from "./blofinClient"

type BlofinBalanceDetail =
 {
  currency: string
  equity: string
  balance: string
  available: string
  equityUsd?: string
 }

type BlofinBalanceData =
 {
  ts: string
  totalEquity: string
  isolatedEquity: string
  details: BlofinBalanceDetail[]
 }

export async function getBalancesBlofin
(
 creds: BlofinCredentials,
): Promise<BrokerBalance[]>
{
 const res =
  await blofinClient.request<BlofinBalanceData>(
   creds,
   "/api/v1/account/balance",
   "GET",
   { query: "productType=USDT-FUTURES" },
  )

 if (res.code !== "0" || !res.data)
  throw new Error(
   `Blofin getBalances failed: ${res.code} ${res.msg}`,
  )

  return res.data.details.map((d) =>
  ({
   currency: d.currency,
   equity: Number(d.equity),
   balance: Number(d.balance),
   available: Number(d.available),
   raw: d,
  }))
}

export async function getBalances(userId: string): Promise<BrokerBalance[]> {
  // TODO: Replace this placeholder with a credential-backed Blofin lookup when the broker link flow is finalized.
  return [
    {
      currency: "USD",
      total: 0,
      available: 0,
      locked: 0,
      raw: { userId, note: "TODO: implement Blofin balances fetch" },
    },
  ];
}
