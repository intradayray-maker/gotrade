import { Tables } from "@/types/supabase";
import { decrypt } from "@/lib/encryption";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const ALPACA_PAPER_BASE_URL =
  process.env.ALPACA_PAPER_BASE_URL ?? "https://paper-api.alpaca.markets";
const ALPACA_LIVE_BASE_URL =
  process.env.ALPACA_LIVE_BASE_URL ?? "https://api.alpaca.markets";

type AlpacaClientConfig = {
  baseUrl: string;
  apiKeyId: string;
  apiSecret: string;
};

async function getBrokerConnection(userId: string): Promise<Tables<"broker_connections">> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("broker_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("broker", "alpaca")
    .single();

  if (error || !data) {
    throw new Error("Alpaca connection not found");
  }

  return data;
}

function createAlpacaConfig(connection: Tables<"broker_connections">): AlpacaClientConfig {
  if (!connection.api_key_id || !connection.api_secret_encrypted) {
    throw new Error("Alpaca credentials are incomplete");
  }

  const apiSecret = decrypt(connection.api_secret_encrypted);
  const baseUrl = connection.paper_trading ? ALPACA_PAPER_BASE_URL : ALPACA_LIVE_BASE_URL;

  return {
    baseUrl,
    apiKeyId: connection.api_key_id,
    apiSecret,
  };
}

async function alpacaFetch<T>(
  config: AlpacaClientConfig,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "APCA-API-KEY-ID": config.apiKeyId,
      "APCA-API-SECRET-KEY": config.apiSecret,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Alpaca error: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function getAlpacaConfigForUser(userId: string) {
  const connection = await getBrokerConnection(userId);
  return createAlpacaConfig(connection);
}

export async function getAlpacaAccount(userId: string) {
  const config = await getAlpacaConfigForUser(userId);
  return alpacaFetch<any>(config, "/v2/account");
}

export async function getAlpacaPositions(userId: string) {
  const config = await getAlpacaConfigForUser(userId);
  return alpacaFetch<any[]>(config, "/v2/positions");
}

export async function placeAlpacaOrder(userId: string, body: unknown) {
  const config = await getAlpacaConfigForUser(userId);
  return alpacaFetch<any>(config, "/v2/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function cancelAlpacaOrder(userId: string, orderId: string) {
  const config = await getAlpacaConfigForUser(userId);
  return alpacaFetch<any>(config, `/v2/orders/${orderId}`, {
    method: "DELETE",
  });
}
