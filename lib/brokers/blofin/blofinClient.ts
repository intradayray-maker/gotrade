// lib/brokers/blofin/blofinClient.ts

import
{
 signBlofinRequest,
} from "./signBlofinRequest"

export type BlofinCredentials =
 {
  apiKey: string
  apiSecret: string
  apiPassphrase: string
 }

export type BlofinResponse<T = unknown> =
 {
  code: string
  msg: string
  data?: T
 }

export type BlofinAlgoSide =
 "buy" | "sell"

export type BlofinAlgoType =
 "market" | "limit" | "stop"

export type BlofinAlgoSignalPayload =
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
  timestamp: number
 }

async function blofinFetch<T = unknown>
(
 creds: BlofinCredentials,
 path: string,
 method: "GET" | "POST" | "DELETE",
 options?: {
  query?: string
  body?: unknown
 },
): Promise<BlofinResponse<T>>
{
 const signed =
  signBlofinRequest({
   baseUrl: process.env.BLOFIN_API_BASE,
   path,
   method,
   query: options?.query,
   body: options?.body,
   apiKey: creds.apiKey,
   apiSecret: creds.apiSecret,
   apiPassphrase: creds.apiPassphrase,
  })

 const res =
  await fetch(signed.url,
   {
    method: signed.method,
    headers: signed.headers,
    body: method === "GET"
     ? undefined
     : signed.bodyString,
   })

 const json =
  await res.json().catch(() => null)

 if (!json)
  throw new Error("Blofin: invalid JSON response")

 return json as BlofinResponse<T>
}

export const blofinClient =
 {
  request: blofinFetch,
 }
