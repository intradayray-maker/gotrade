// lib/brokers/blofin/getAccount.ts

import type
{
 BrokerAccount,
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

export async function getAccountBlofin
(
 creds: BlofinCredentials,
): Promise<BrokerAccount>
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
   `Blofin getAccount failed: ${res.code} ${res.msg}`,
  )

 const totalEquity =
  Number(res.data.totalEquity ?? 0)

 return {
  broker: "blofin",
  equity: totalEquity,
  raw: res,
 }
}

export async function getAccount(userId: string): Promise<BrokerAccount> {
  // TODO: Replace this placeholder with a credential-backed Blofin lookup when the broker link flow is finalized.
  return {
    broker: "blofin",
    id: userId,
    status: "placeholder",
    equity: 0,
    buyingPower: 0,
    availableBalance: 0,
    raw: { userId, note: "TODO: implement Blofin account fetch" },
  };
}
