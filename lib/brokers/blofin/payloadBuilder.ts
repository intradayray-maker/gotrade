// lib/brokers/blofin/payloadBuilder.ts

import type
{
 BrokerOrderRequest,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinAlgoSignalPayload,
 BlofinAlgoSide,
 BlofinAlgoType,
} from "./blofinClient"

export function buildBlofinAlgoPayload
(
 order: BrokerOrderRequest,
): BlofinAlgoSignalPayload
{
 const timestamp =
  Date.now()

 const side: BlofinAlgoSide =
  order.side === "sell" ? "sell" : "buy"

 return {
  symbol: order.symbol,
  side,
  type: (order.type ?? "market") as BlofinAlgoType,
  quantity: String(order.quantity ?? order.qty ?? 0),
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
  timestamp,
 }
}
