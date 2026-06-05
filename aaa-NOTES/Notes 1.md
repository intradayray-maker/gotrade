⭐ 1. /app/api/trade/route.ts (the new no‑DB version)
This is the heart of the system now.

I need to confirm:

latestTrade and latestBar are stored correctly

POST logic is correct

GET logic is correct

No leftover Supabase imports

No user_id logic

No DB writes

No DB reads

This file is critical.

⭐ 2. /app/dashboard/tools/ForexTradeOutputCard.tsx
This is where:

Required Margin is displayed

Position Size is displayed

Risk Distance is displayed

Trade Execution Details are shown

I need to confirm:

It polls /api/trade correctly

It uses the returned trade object

It uses Dollar Risk + Leverage from localStorage/Zustand

It recomputes Required Margin correctly

No leftover Supabase references

No userId props

This file is critical.

⭐ 3. /app/dashboard/tools/ForexAiCard.tsx
This card controls:

Dollar Risk Per Trade

Leverage

LocalStorage persistence

Required Margin math (if shared)

I need to confirm:

It stores settings client‑side

It exposes them to the Output card

No Supabase references

No userId

No backend calls

This file is critical.

⭐ 4. /app/dashboard/page.tsx
I need to confirm:

No userId is passed to Forex cards

No props mismatch

No leftover Supabase logic affecting Forex tools

This file is important, but not critical.






⭐ 5. (Optional) /app/api/bar/route.ts if it exists
Some versions of your system had a separate bar route.

If it exists, paste it.






⭐ 6. (Optional) Zustand or context store for Forex settings
If you created:

Code
useForexSettings.ts
useRiskSettings.ts
useLeverageStore.ts
Paste it.