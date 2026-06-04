import { getAlpacaConfigForUser } from "./alpacaClient";

export async function fetchTradesForUser(userId: string) {
  const config = await getAlpacaConfigForUser(userId);

  const params = new URLSearchParams();
  params.set("activity_types", "FILL");

  const res = await fetch(
    `${config.baseUrl}/v2/account/activities?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        "APCA-API-KEY-ID": config.apiKeyId,
        "APCA-API-SECRET-KEY": config.apiSecret,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch trades from Alpaca");
  }

  const activities = await res.json();

  return activities
    .filter((a: any) => a.activity_type === "FILL")
    .map((a: any) => ({
      id: a.id,
      symbol: a.symbol,
      side: a.side,
      qty: Number(a.qty),
      price: Number(a.price),
      created_at: a.transaction_time,
    }));
}
