export function getBrokerApiBase(): "/api/blofin" | "/api/alpaca" {
  return process.env.NEXT_PUBLIC_BROKER === "blofin" ? "/api/blofin" : "/api/alpaca";
}
