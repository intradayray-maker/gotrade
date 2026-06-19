import Alpaca from "@alpacahq/alpaca-trade-api";

export type AlpacaEnvironment = "paper" | "live";

export function normalizeAlpacaEnvironment(env: string | undefined): AlpacaEnvironment {
  if (!env) return "paper";
  const lower = env.toLowerCase();
  return lower === "live" ? "live" : "paper";
}

export function createAlpacaClient(
  keyId: string,
  secretKey: string,
  environment: AlpacaEnvironment
) {
  return new Alpaca({
    keyId,
    secretKey,
    paper: environment === "paper",
  });
}

export * from "@/lib/brokers/alpaca/getBalances";
