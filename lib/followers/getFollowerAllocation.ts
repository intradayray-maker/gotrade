import { supabaseAdmin } from "@/lib/supabase/admin"
import type
{
 FollowerAllocationSettings,
 FollowerAccountContext,
} from "./allocationTypes"

export async function getFollowerAllocationSettings
(
 userId: string,
): Promise<FollowerAllocationSettings | null>
{
 const { data, error } =
  await supabaseAdmin
   .from("follower_allocation_settings")
   .select("mode, value, max_allocation_pct, enabled")
   .eq("user_id", userId)
   .maybeSingle()

 if (error || !data)
  return null

 return {
  userId,
  mode: data.mode,
  value: Number(data.value),
  maxAllocationPct: data.max_allocation_pct !== null
   ? Number(data.max_allocation_pct)
   : undefined,
  enabled: data.enabled,
 }
}

export async function getFollowerAccountContext
(
 userId: string,
): Promise<FollowerAccountContext | null>
{
 const { data, error } =
  await supabaseAdmin
   .from("broker_accounts")
   .select("equity")
   .eq("user_id", userId)
   .maybeSingle()

 if (error || !data)
  return null

 return {
  equity: Number(data.equity ?? 0),
 }
}
