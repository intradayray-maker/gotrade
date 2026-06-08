// lib\database.types.ts


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      broker_connections: {
        Row: {
          api_key_id: string | null
          api_secret_encrypted: string | null
          broker: string | null
          created_at: string | null
          id: string
          paper_trading: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          api_secret_encrypted?: string | null
          broker?: string | null
          created_at?: string | null
          id?: string
          paper_trading?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          api_secret_encrypted?: string | null
          broker?: string | null
          created_at?: string | null
          id?: string
          paper_trading?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ETHUSDT_bar_state: {
        Row: {
          high: number | null
          id: string
          low: number | null
          ticker: string | null
          timestamp: string | null
        }
        Insert: {
          high?: number | null
          id?: string
          low?: number | null
          ticker?: string | null
          timestamp?: string | null
        }
        Update: {
          high?: number | null
          id?: string
          low?: number | null
          ticker?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      ETHUSDT_news_state: {
        Row: {
          id: string
          news_countdown: number | null
          news_message: string | null
          news_today: boolean | null
          news_window_active: boolean | null
          next_news_time: string | null
          ticker: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          news_countdown?: number | null
          news_message?: string | null
          news_today?: boolean | null
          news_window_active?: boolean | null
          next_news_time?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          news_countdown?: number | null
          news_message?: string | null
          news_today?: boolean | null
          news_window_active?: boolean | null
          next_news_time?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      ETHUSDT_trades_state: {
        Row: {
          entry: number | null
          id: string
          side: string | null
          stop: number | null
          ticker: string | null
          timestamp: string | null
          tp: number | null
          type: string | null
        }
        Insert: {
          entry?: number | null
          id?: string
          side?: string | null
          stop?: number | null
          ticker?: string | null
          timestamp?: string | null
          tp?: number | null
          type?: string | null
        }
        Update: {
          entry?: number | null
          id?: string
          side?: string | null
          stop?: number | null
          ticker?: string | null
          timestamp?: string | null
          tp?: number | null
          type?: string | null
        }
        Relationships: []
      }
      EURUSD_bar_state: {
        Row: {
          high: number | null
          id: string
          low: number | null
          ticker: string | null
          timestamp: string | null
        }
        Insert: {
          high?: number | null
          id?: string
          low?: number | null
          ticker?: string | null
          timestamp?: string | null
        }
        Update: {
          high?: number | null
          id?: string
          low?: number | null
          ticker?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      EURUSD_news_state: {
        Row: {
          id: string
          news_countdown: number | null
          news_message: string | null
          news_today: boolean | null
          news_window_active: boolean | null
          next_news_time: string | null
          ticker: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          news_countdown?: number | null
          news_message?: string | null
          news_today?: boolean | null
          news_window_active?: boolean | null
          next_news_time?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          news_countdown?: number | null
          news_message?: string | null
          news_today?: boolean | null
          news_window_active?: boolean | null
          next_news_time?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      EURUSD_trades_state: {
        Row: {
          entry: number | null
          id: string
          side: string | null
          stop: number | null
          ticker: string | null
          timestamp: string | null
          tp: number | null
          type: string | null
        }
        Insert: {
          entry?: number | null
          id?: string
          side?: string | null
          stop?: number | null
          ticker?: string | null
          timestamp?: string | null
          tp?: number | null
          type?: string | null
        }
        Update: {
          entry?: number | null
          id?: string
          side?: string | null
          stop?: number | null
          ticker?: string | null
          timestamp?: string | null
          tp?: number | null
          type?: string | null
        }
        Relationships: []
      }
      gotrade_preorders: {
        Row: {
          capital: number | null
          created_at: string | null
          email: string
          id: string
          name: string | null
        }
        Insert: {
          capital?: number | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          capital?: number | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      hwm_history: {
        Row: {
          created_at: string | null
          hwm: number
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          hwm: number
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          hwm?: number
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      master_signals: {
        Row: {
          id: string
          price: number | null
          qty: number
          raw_payload: Json
          received_at: string | null
          side: string
          symbol: string
          valid: boolean | null
          validation_error: string | null
        }
        Insert: {
          id?: string
          price?: number | null
          qty: number
          raw_payload: Json
          received_at?: string | null
          side: string
          symbol: string
          valid?: boolean | null
          validation_error?: string | null
        }
        Update: {
          id?: string
          price?: number | null
          qty?: number
          raw_payload?: Json
          received_at?: string | null
          side?: string
          symbol?: string
          valid?: boolean | null
          validation_error?: string | null
        }
        Relationships: []
      }
      master_trades: {
        Row: {
          created_at: string | null
          error_message: string | null
          filled_avg_price: number | null
          filled_qty: number | null
          id: string
          order_id: string | null
          qty: number
          side: string
          signal_id: string | null
          status: string
          symbol: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          filled_avg_price?: number | null
          filled_qty?: number | null
          id?: string
          order_id?: string | null
          qty: number
          side: string
          signal_id?: string | null
          status?: string
          symbol: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          filled_avg_price?: number | null
          filled_qty?: number | null
          id?: string
          order_id?: string | null
          qty?: number
          side?: string
          signal_id?: string | null
          status?: string
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_trades_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "master_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          billing_status: string | null
          current_period_end: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          nextbillingdate: number | null
          plan_ETHUSDT: boolean | null
          plan_EURUSD: boolean | null
          plan_PRO_BUNDLE: boolean | null
          planname: string | null
          role: string | null
          stripe_customer_id: string | null
          stripe_default_payment_method: string | null
          stripe_lookup_key: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          billing_status?: string | null
          current_period_end?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          nextbillingdate?: number | null
          plan_ETHUSDT?: boolean | null
          plan_EURUSD?: boolean | null
          plan_PRO_BUNDLE?: boolean | null
          planname?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_default_payment_method?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_status?: string | null
          current_period_end?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          nextbillingdate?: number | null
          plan_ETHUSDT?: boolean | null
          plan_EURUSD?: boolean | null
          plan_PRO_BUNDLE?: boolean | null
          planname?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_default_payment_method?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      stripe_prices: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          lookup_key: string
          product_name: string
          stripe_price_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          lookup_key: string
          product_name: string
          stripe_price_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          lookup_key?: string
          product_name?: string
          stripe_price_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_lookup_key: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          correction_qty: number | null
          created_at: string | null
          error_message: string | null
          follower_qty: number | null
          follower_user_id: string | null
          id: string
          master_qty: number | null
          status: string
          symbol: string
        }
        Insert: {
          correction_qty?: number | null
          created_at?: string | null
          error_message?: string | null
          follower_qty?: number | null
          follower_user_id?: string | null
          id?: string
          master_qty?: number | null
          status: string
          symbol: string
        }
        Update: {
          correction_qty?: number | null
          created_at?: string | null
          error_message?: string | null
          follower_qty?: number | null
          follower_user_id?: string | null
          id?: string
          master_qty?: number | null
          status?: string
          symbol?: string
        }
        Relationships: []
      }
      trade_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          follower_user_id: string | null
          id: string
          last_error: string | null
          master_trade_id: string | null
          max_attempts: number | null
          qty: number
          side: string
          status: string
          symbol: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          follower_user_id?: string | null
          id?: string
          last_error?: string | null
          master_trade_id?: string | null
          max_attempts?: number | null
          qty: number
          side: string
          status?: string
          symbol: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          follower_user_id?: string | null
          id?: string
          last_error?: string | null
          master_trade_id?: string | null
          max_attempts?: number | null
          qty?: number
          side?: string
          status?: string
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_queue_master_trade_id_fkey"
            columns: ["master_trade_id"]
            isOneToOne: false
            referencedRelation: "master_trades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_equity: { Args: { uid: string }; Returns: number }
      get_monthly_equity: {
        Args: { end_ts: string; start_ts: string; uid: string }
        Returns: {
          equity: number
          snapshot_ts: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
