// lib/brokers/blofin/signBlofinRequest.ts

import crypto from "crypto"

export type BlofinMethod =
 "GET" | "POST" | "DELETE"

export type BlofinSignInput =
 {
  baseUrl?: string
  path: string
  method: BlofinMethod
  query?: string
  body?: unknown
  apiKey: string
  apiSecret: string
  apiPassphrase: string
  nonce?: string
 }

export type BlofinSignedRequest =
 {
  url: string
  method: BlofinMethod
  headers: Record<string, string>
  bodyString: string
  timestamp: string
  nonce: string
 }

function toBodyString(body: unknown)
{
 if (!body)
  return ""

 if (typeof body === "string")
  return body

 return JSON.stringify(body)
}

/**
 * NOTE:
 * This follows the Blofin REST API Authentication/Signature page:
 * - ACCESS-KEY
 * - ACCESS-SIGN
 * - ACCESS-TIMESTAMP
 * - ACCESS-NONCE
 * - ACCESS-PASSPHRASE
 * - prehash string → HMAC-SHA256 → hex → Base64
 *
 * If Blofin’s prehash format differs, adjust `prehash` accordingly.
 */
export function signBlofinRequest(input: BlofinSignInput): BlofinSignedRequest
{
 const baseUrl =
  input.baseUrl ?? process.env.BLOFIN_API_BASE ?? "https://api.blofin.com"

 const timestamp =
  String(Date.now())

 const nonce =
  input.nonce ?? crypto.randomUUID()

 const bodyString =
  toBodyString(input.body)

 const requestPath =
  input.query
   ? `${input.path}?${input.query}`
   : input.path

 const prehash =
  `${timestamp}${nonce}${input.method}${requestPath}${bodyString}`

 const hmac =
  crypto.createHmac("sha256", input.apiSecret)

 hmac.update(prehash)

 const hex =
  hmac.digest("hex")

 const signature =
  Buffer.from(hex, "utf8").toString("base64")

 const url =
  `${baseUrl}${requestPath}`

 const headers: Record<string, string> =
  {
   "Content-Type": "application/json",
   "ACCESS-KEY": input.apiKey,
   "ACCESS-SIGN": signature,
   "ACCESS-TIMESTAMP": timestamp,
   "ACCESS-NONCE": nonce,
   "ACCESS-PASSPHRASE": input.apiPassphrase,
  }

 return {
  url,
  method: input.method,
  headers,
  bodyString,
  timestamp,
  nonce,
 }
}
