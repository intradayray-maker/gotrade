import type
{
 FollowerAllocationSettings,
 FollowerAccountContext,
 MasterRiskConfig,
} from "./allocationTypes"

const DEFAULT_MASTER_RISK: number =
 Number(process.env.MASTER_DOLLAR_RISK ?? "0.2")

export function computeFollowerRisk
(
 settings: FollowerAllocationSettings,
 context: FollowerAccountContext,
 masterRiskConfig?: MasterRiskConfig,
): number
{
 if (!settings.enabled)
  return 0

 const masterDollarRisk =
  masterRiskConfig?.masterDollarRisk ?? DEFAULT_MASTER_RISK

 let followerRisk =
  0

 if (settings.mode === "fixed_dollar")
 {
  followerRisk =
   settings.value
 }

 if (settings.mode === "percent_equity")
 {
  followerRisk =
   context.equity * settings.value
 }

 if (settings.mode === "multiplier")
 {
  followerRisk =
   masterDollarRisk * settings.value
 }

 if (settings.maxAllocationPct && settings.maxAllocationPct > 0)
 {
  const maxRisk =
   context.equity * settings.maxAllocationPct

  if (followerRisk > maxRisk)
   followerRisk = maxRisk
 }

 return followerRisk
}

export function computeFollowerQtyFromMaster
(
 masterQty: number,
 masterRiskConfig: MasterRiskConfig,
 followerRisk: number,
): number
{
 const masterDollarRisk =
  masterRiskConfig.masterDollarRisk

 if (masterDollarRisk <= 0)
  return 0

 if (followerRisk <= 0)
  return 0

 const multiplier =
  followerRisk / masterDollarRisk

 const followerQty =
  masterQty * multiplier

 return followerQty
}
