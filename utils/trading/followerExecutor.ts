// utils/trading/followerExecutor.ts

import { placeOrder } from "@/lib/brokers/router"
import { supabaseAdmin } from "@/lib/supabase/admin"

// -------------------------------
// CONFIG — your Pine Script risk
// -------------------------------
const MASTER_DOLLAR_RISK = Number(process.env.MASTER_DOLLAR_RISK ?? "0.2")

// -------------------------------
// Load follower allocation settings
// -------------------------------
async function getFollowerAllocationSettings(userId: string)
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
  mode: data.mode,
  value: Number(data.value),
  maxAllocationPct: data.max_allocation_pct
   ? Number(data.max_allocation_pct)
   : undefined,
  enabled: data.enabled,
 }
}

// -------------------------------
// Load follower account equity
// -------------------------------
async function getFollowerAccountContext(userId: string)
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

// -------------------------------
// Compute follower risk per trade
// -------------------------------
function computeFollowerRisk(settings: any, context: any)
{
 if (!settings?.enabled)
  return 0

 let followerRisk = 0

 if (settings.mode === "fixed_dollar")
  followerRisk = settings.value

 if (settings.mode === "percent_equity")
  followerRisk = context.equity * settings.value

 if (settings.mode === "multiplier")
  followerRisk = MASTER_DOLLAR_RISK * settings.value

 // enforce max allocation cap
 if (settings.maxAllocationPct)
 {
  const maxRisk = context.equity * settings.maxAllocationPct
  if (followerRisk > maxRisk)
   followerRisk = maxRisk
 }

 return followerRisk
}

// -------------------------------
// Convert master qty → follower qty
// -------------------------------
function computeFollowerQty(masterQty: number, followerRisk: number)
{
 if (MASTER_DOLLAR_RISK <= 0)
  return 0

 if (followerRisk <= 0)
  return 0

 const multiplier = followerRisk / MASTER_DOLLAR_RISK
 return masterQty * multiplier
}

// -------------------------------
// MAIN EXECUTOR
// -------------------------------
export async function executeFollowerTrade(intent: any)
{
 // Load all active followers
 const { data: followers } =
  await supabaseAdmin
   .from("subscriptions")
   .select("user_id, risk_multiplier")
   .eq("active", true)

 if (!followers?.length)
  return

 for (const f of followers)
 {
  const userId = f.user_id

  // Load allocation settings + equity
  const [settings, context] = await Promise.all([
   getFollowerAllocationSettings(userId),
   getFollowerAccountContext(userId),
  ])

  // If missing settings, fallback to old risk_multiplier
  let followerQty = 0

  if (settings && context)
  {
   const followerRisk =
    computeFollowerRisk(settings, context)

   followerQty =
    computeFollowerQty(intent.qty, followerRisk)
  }
  else
  {
   // BACKWARDS COMPATIBILITY
   followerQty =
    intent.qty * (f.risk_multiplier ?? 1)
  }

  if (followerQty <= 0)
   continue

  // Build order
  const order =
   {
    symbol: intent.symbol,
    side: intent.side,
    qty: followerQty,
    accountType: "follower" as const,
    userId,
   }

  // Execute via router (Blofin/Alpaca)
  const execution =
   await placeOrder(order)

  // Log execution
  await supabaseAdmin
   .from("executions")
   .insert({
    intent_id: intent.id,
    role: "follower",
    user_id: userId,
    symbol: intent.symbol,
    side: intent.side,
    qty: followerQty,
    raw: execution,
   })
 }
}

export const runFollowerExecutor = executeFollowerTrade
