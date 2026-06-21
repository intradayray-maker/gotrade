// utils/trading/tradeIntentEngine.ts

import { supabaseAdmin } from "@/lib/supabase/admin"
import { runMasterExecutor } from "./masterExecutor"

export async function createTradeIntent(alert: any)
{
 const symbol =
  alert.symbol ?? alert.ticker ?? alert.SYMBOL

 const side =
  alert.side?.toLowerCase()

 const type =
  alert.type?.toLowerCase() ?? "market"

 const qty =
  Number(alert.qty ?? alert.quantity ?? 0)

 if (!symbol || !side || !qty)
  throw new Error("Missing required fields")

 const { data, error } =
  await supabaseAdmin
   .from("trade_intents")
   .insert({
    symbol,
    side,
    type,
    qty,
    raw: alert,
   })
   .select()
   .single()

 if (error)
  throw error

 await runMasterExecutor(data)

 return data
}
