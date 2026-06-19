// lib/brokers/blofin/placeOrder.ts

import type
{
 BrokerOrderRequest,
 BrokerOrderResponse,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinCredentials,
} from "./blofinClient"

import
{
 blofinClient,
} from "./blofinClient"

import
{
 buildBlofinPayload,
} from "./buildBlofinPayload"

export async function placeOrderBlofin
(
 creds: BlofinCredentials,
 order: BrokerOrderRequest,
): Promise<BrokerOrderResponse>
{
 const payload =
  buildBlofinPayload(order)

 const res =
  await blofinClient.request(
   creds,
   "/uapi/v1/algo/signal/trigger",
   "POST",
   { body: payload },
  )

 if (res.code !== "0")
  throw new Error(
   `Blofin placeOrder failed: ${res.code} ${res.msg}`,
  )

 return {
  broker: "blofin",
  raw: res,
 }
}

export async function placeOrder(
  params: {
    symbol: string;
    side: "buy" | "sell";
    qty: number;
    accountType: "master" | "follower";
    userId?: string;
  }
): Promise<BrokerOrderResponse> {
  // TODO: Replace this placeholder with a credential-backed Blofin order placement when the broker link flow is finalized.
  return {
    broker: "blofin",
    id: `blofin-order-${params.userId ?? "unknown"}`,
    symbol: params.symbol,
    status: "placeholder",
    filledQty: 0,
    filledAvgPrice: 0,
    raw: { params, note: "TODO: implement Blofin order placement" },
  };
}
