export type BrokerName = string;

export type BrokerEnvironment = string;

export interface BrokerAccount {
  broker: BrokerName;
  id?: string;
  status?: string;
  currency?: string;
  equity?: number | string | null;
  buyingPower?: number | string | null;
  availableBalance?: number | string | null;
  raw?: unknown;
}

export interface BrokerPosition {
  symbol: string;
  qty: number | string;
  side?: string;
  entryPrice?: number | string | null;
  markPrice?: number | string | null;
  marketValue?: number | string | null;
  unrealizedPnl?: number | string | null;
  raw?: unknown;
}

export interface BrokerOrderRequest {
  symbol: string;
  side: "buy" | "sell" | string;
  type?: string;
  quantity: number;
  qty?: number;
  orderType?: string;
  timeInForce?: string;
  price?: number | string | null;
  stopPrice?: number | string | null;
  takeProfitPrice?: number | string | null;
  leverage?: number | string | null;
  clientOrderId?: string;
  strategyId?: string;
  accountType?: "master" | "follower" | string;
  userId?: string;
  reduceOnly?: boolean;
  raw?: unknown;
}

export interface BrokerOrderResponse {
  broker: BrokerName;
  id?: string;
  symbol?: string;
  status?: string;
  filledQty?: number | string | null;
  filledAvgPrice?: number | string | null;
  raw?: unknown;
}

export interface BrokerCancelResponse {
  broker: BrokerName;
  success?: boolean;
  id?: string;
  raw?: unknown;
}

export interface BrokerTrade {
  id: string;
  symbol: string;
  side: string;
  qty: number;
  price?: number | string | null;
  createdAt?: string;
  raw?: unknown;
}

export interface BrokerBalance {
  currency?: string;
  total?: number | string | null;
  available?: number | string | null;
  locked?: number | string | null;
  raw?: unknown;
}
