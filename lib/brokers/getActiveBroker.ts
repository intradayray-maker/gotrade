export type ActiveBroker = "alpaca" | "blofin";

export function getActiveBroker(): ActiveBroker {
  const broker = process.env.NEXT_PUBLIC_BROKER?.toLowerCase();

  if (broker === "blofin") {
    return "blofin";
  }

  return "alpaca";
}
