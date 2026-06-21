export type AllocationMode =
 | "fixed_dollar"      // e.g. $10,400 per trade
 | "percent_equity"    // e.g. 2% of account
 | "multiplier"        // e.g. 3x Ray's size

export type FollowerAllocationSettings =
 {
  userId: string
  mode: AllocationMode
  value: number          // meaning depends on mode
  maxAllocationPct?: number // hard cap vs equity, e.g. 0.8 = 80%
  enabled: boolean
 }

export type FollowerAccountContext =
 {
  equity: number        // follower account equity in quote currency
 }

export type MasterRiskConfig =
 {
  masterDollarRisk: number // your Pine's dollar_risk (e.g. 0.2)
 }
