//app\dashboard\copy-trading\CopyTradingClient.tsx

"use client";

import type { Tables } from "@/types/supabase";
import MasterPerformanceCard from "./MasterPerformanceCard";
import UnifiedSettingsForm from "./UnifiedSettingsForm";

export type Settings = {
  enabled: boolean
  allocation_value: number
  allocation_mode: string
  max_allocation_pct: number | null
}

export default function CopyTradingClient({
  initialSettings,
}: {
  initialSettings: Settings | null;
}) {
  return (
    <div className="max-w-6xl mx-auto pt-6 pb-20 space-y-12">
      <UnifiedSettingsForm initialSettings={initialSettings} />
    </div>
  );
}
