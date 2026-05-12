"use client";

import type { Tables } from "@/types/supabase";
import MasterPerformanceCard from "./MasterPerformanceCard";
import UnifiedSettingsForm from "./UnifiedSettingsForm";

type Settings = Pick<
  Tables<"copy_trading_settings">,
  | "allocation_model"
  | "allocation_value"
  | "enabled"
  | "max_daily_loss"
  | "max_position_size"
  | "risk_multiplier"
>;

export default function CopyTradingClient({
  initialSettings,
}: {
  initialSettings: Settings | null;
}) {
  return (
    <div className="max-w-6xl mx-auto pt-10 pb-20 space-y-12">
      <UnifiedSettingsForm initialSettings={initialSettings} />
    </div>
  );
}
