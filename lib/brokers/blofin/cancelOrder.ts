// lib/brokers/blofin/cancelOrder.ts

import type
{
 BrokerCancelResponse,
 BrokerOrderResponse,
} from "@/lib/brokers/brokerTypes"

import type
{
 BlofinCredentials,
} from "./blofinClient"

/**
 * Blofin ALGO cancel support depends on the specific
 * ALGO endpoint you choose to use.
 *
 * For now, expose a clear "not supported" implementation
 * instead of guessing an endpoint.
 */
export async function cancelOrderBlofin
(
 _creds: BlofinCredentials,
 _clientOrderId: string,
): Promise<BrokerCancelResponse>
{
 throw new Error("Blofin cancelOrder is not implemented for ALGO signals")
}

export async function cancelOrder(
  userId: string,
  orderId: string
): Promise<BrokerOrderResponse> {
  // TODO: Replace this placeholder with a credential-backed Blofin cancellation when the broker link flow is finalized.
  return {
    broker: "blofin",
    id: orderId,
    status: "placeholder",
    raw: { userId, orderId, note: "TODO: implement Blofin cancellation" },
  };
}
