import type { Database } from "@/types/supabase";

export type CopyTradingSettingsRow =
  Database["public"]["Tables"]["copy_trading_settings"]["Row"];

export type CopyTradingSettingsUpdate =
  Database["public"]["Tables"]["copy_trading_settings"]["Update"];

export type CopyTradingSettingsPayload = Partial<
  Pick<
    CopyTradingSettingsUpdate,
    | "allocation_model"
    | "allocation_value"
    | "risk_multiplier"
    | "max_daily_loss"
    | "max_position_size"
    | "enabled"
  >
>;

export type CopyTradingSettingsApiResponse =
  | {
      success: true;
      settings: CopyTradingSettingsRow | null;
    }
  | {
      success: false;
      error: string;
    };
