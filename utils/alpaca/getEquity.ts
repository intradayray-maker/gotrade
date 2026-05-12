import { createServerClient } from "@/utils/supabase/server";
import { createAlpacaClient } from "@/utils/alpaca";

export async function getAlpacaEquity(userId: string): Promise<number> {
  const supabase = await createServerClient();

  const { data: keys } = await supabase
    .from("alpaca_keys")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!keys) {
    throw new Error("No Alpaca keys found");
  }

  const client = createAlpacaClient(
    keys.key_id,
    keys.secret_key,
    keys.environment as "paper" | "live"
  );

  const account = await client.getAccount();
  return parseFloat(account.equity);
}
