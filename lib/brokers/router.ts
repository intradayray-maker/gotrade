// lib/brokers/router.ts

import { getActiveBroker } from "@/lib/brokers/getActiveBroker"

import
{
 getAlpacaAccount,
 getAlpacaPositions,
 cancelAlpacaOrder,
} from "@/lib/brokers/alpaca/alpacaClient"

import
{
 getBalances as getAlpacaBalances,
} from "@/lib/brokers/alpaca/getBalances"

import
{
 placeOrder as placeAlpacaOrder,
} from "@/lib/brokers/alpaca/placeOrder"

import
{
 getAccount as getBlofinAccount,
} from "@/lib/brokers/blofin/getAccount"

import
{
 getBalances as getBlofinBalances,
} from "@/lib/brokers/blofin/getBalances"

import
{
 getPositions as getBlofinPositions,
} from "@/lib/brokers/blofin/getPositions"

import
{
 placeOrder as placeBlofinOrder,
} from "@/lib/brokers/blofin/placeOrder"

import
{
 cancelOrder as cancelBlofinOrder,
} from "@/lib/brokers/blofin/cancelOrder"

type TradeOrderParams =
 {
  symbol: string
  side: "buy" | "sell"
  qty: number
  accountType: "master" | "follower"
  userId?: string
 }

export async function getAccount(userId: string)
{
 const activeBroker =
  getActiveBroker()

 if (activeBroker === "blofin")
 {
  // TODO: Blofin will become the default account source once the migration is complete.
  return getBlofinAccount(userId)
 }

 // TODO: Keep Alpaca as the fallback until Blofin parity is complete.
 return getAlpacaAccount(userId)
}

export async function getPositions(userId: string)
{
 const activeBroker =
  getActiveBroker()

 if (activeBroker === "blofin")
 {
  // TODO: Blofin positions will replace Alpaca positions after migration.
  return getBlofinPositions(userId)
 }

 // TODO: Keep Alpaca as the fallback until Blofin parity is complete.
 return getAlpacaPositions(userId)
}

export async function getBalances(userId: string)
{
 const activeBroker =
  getActiveBroker()

 if (activeBroker === "blofin")
 {
  // TODO: Blofin balances will replace Alpaca balances after migration.
  return getBlofinBalances(userId)
 }

 // TODO: Keep Alpaca as the fallback until Blofin parity is complete.
 return getAlpacaBalances(userId)
}

export async function placeOrder(params: TradeOrderParams)
{
 const activeBroker =
  getActiveBroker()

 if (activeBroker === "blofin")
 {
  // TODO: Blofin order placement will replace Alpaca order placement after migration.
  return placeBlofinOrder(params)
 }

 // TODO: Keep Alpaca as the fallback until Blofin parity is complete.
 return placeAlpacaOrder(params)
}

export async function cancelOrder
(
 userId: string,
 orderId: string,
)
{
 const activeBroker =
  getActiveBroker()

 if (activeBroker === "blofin")
 {
  // TODO: Blofin order cancellation will replace Alpaca order cancellation after migration.
  return cancelBlofinOrder(userId, orderId)
 }

 // TODO: Keep Alpaca as the fallback until Blofin parity is complete.
 return cancelAlpacaOrder(userId, orderId)
}
