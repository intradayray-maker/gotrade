// lib/brokers/blofin/buildBlofinPayload.ts

import type
{
 BrokerOrderRequest,
} from "@/lib/brokers/brokerTypes"

export type BlofinAlgoSide =
 "buy" | "sell"

export type BlofinAlgoType =
 "market" | "limit" | "stop"

export type BlofinAlgoPayload =
 {
  symbol: string
  side: BlofinAlgoSide
  type: BlofinAlgoType
  quantity: string
  price?: string
  stopPrice?: string
  takeProfitPrice?: string
  leverage?: string
  clientOrderId?: string
  strategyId?: string
 }

export function buildBlofinPayload
(
 order: BrokerOrderRequest,
): BlofinAlgoPayload
{
 const side =
  order.side === "sell"
   ? "sell"
   : "buy"

 const type: BlofinAlgoType =
  order.type === "limit"
   ? "limit"
   : order.type === "stop"
   ? "stop"
   : "market"

 const quantity =
  (order.quantity ?? order.qty ?? 0).toString()

 return {
  symbol: order.symbol,
  side,
  type,
  quantity,
  price: order.price
   ? order.price.toString()
   : undefined,
  stopPrice: order.stopPrice
   ? order.stopPrice.toString()
   : undefined,
  takeProfitPrice: order.takeProfitPrice
   ? order.takeProfitPrice.toString()
   : undefined,
  leverage: order.leverage
   ? order.leverage.toString()
   : undefined,
  clientOrderId: order.clientOrderId,
  strategyId: order.strategyId,
 }
}
