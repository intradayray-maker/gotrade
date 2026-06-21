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
      bot_settings: {
        Row: {
          auto_buy_alerts_dashboard_enabled: boolean | null
          auto_buy_alerts_enabled: boolean | null
          auto_buy_alerts_telegram_bot_token: string | null
          auto_buy_alerts_telegram_chat_id: string | null
          auto_buy_alerts_telegram_enabled: boolean | null
          auto_buy_enabled: boolean | null
          auto_buy_mode: string | null
          auto_buy_slippage_bps: number | null
          auto_buy_usd_size: number | null
          auto_sell_alerts_dashboard_enabled: boolean | null
          auto_sell_alerts_enabled: boolean | null
          auto_sell_alerts_telegram_bot_token: string | null
          auto_sell_alerts_telegram_chat_id: string | null
          auto_sell_alerts_telegram_enabled: boolean | null
          auto_sell_enabled: boolean | null
          auto_sell_safety_exit_enabled: boolean | null
          auto_sell_stop_loss_pct: number | null
          auto_sell_take_profit_pct: number | null
          auto_sell_trailing_pct: number | null
          auto_sell_whale_exit_enabled: boolean | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_buy_alerts_dashboard_enabled?: boolean | null
          auto_buy_alerts_enabled?: boolean | null
          auto_buy_alerts_telegram_bot_token?: string | null
          auto_buy_alerts_telegram_chat_id?: string | null
          auto_buy_alerts_telegram_enabled?: boolean | null
          auto_buy_enabled?: boolean | null
          auto_buy_mode?: string | null
          auto_buy_slippage_bps?: number | null
          auto_buy_usd_size?: number | null
          auto_sell_alerts_dashboard_enabled?: boolean | null
          auto_sell_alerts_enabled?: boolean | null
          auto_sell_alerts_telegram_bot_token?: string | null
          auto_sell_alerts_telegram_chat_id?: string | null
          auto_sell_alerts_telegram_enabled?: boolean | null
          auto_sell_enabled?: boolean | null
          auto_sell_safety_exit_enabled?: boolean | null
          auto_sell_stop_loss_pct?: number | null
          auto_sell_take_profit_pct?: number | null
          auto_sell_trailing_pct?: number | null
          auto_sell_whale_exit_enabled?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_buy_alerts_dashboard_enabled?: boolean | null
          auto_buy_alerts_enabled?: boolean | null
          auto_buy_alerts_telegram_bot_token?: string | null
          auto_buy_alerts_telegram_chat_id?: string | null
          auto_buy_alerts_telegram_enabled?: boolean | null
          auto_buy_enabled?: boolean | null
          auto_buy_mode?: string | null
          auto_buy_slippage_bps?: number | null
          auto_buy_usd_size?: number | null
          auto_sell_alerts_dashboard_enabled?: boolean | null
          auto_sell_alerts_enabled?: boolean | null
          auto_sell_alerts_telegram_bot_token?: string | null
          auto_sell_alerts_telegram_chat_id?: string | null
          auto_sell_alerts_telegram_enabled?: boolean | null
          auto_sell_enabled?: boolean | null
          auto_sell_safety_exit_enabled?: boolean | null
          auto_sell_stop_loss_pct?: number | null
          auto_sell_take_profit_pct?: number | null
          auto_sell_trailing_pct?: number | null
          auto_sell_whale_exit_enabled?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bot_trades: {
        Row: {
          entry_liquidity: number | null
          entry_price: number | null
          entry_signal: number | null
          entry_time: string | null
          exit_price: number | null
          exit_time: string | null
          id: number
          mint: string
          pnl: number | null
          pnl_pct: number | null
          reason_exit: string | null
          session: string | null
          trade_json: Json | null
        }
        Insert: {
          entry_liquidity?: number | null
          entry_price?: number | null
          entry_signal?: number | null
          entry_time?: string | null
          exit_price?: number | null
          exit_time?: string | null
          id?: never
          mint: string
          pnl?: number | null
          pnl_pct?: number | null
          reason_exit?: string | null
          session?: string | null
          trade_json?: Json | null
        }
        Update: {
          entry_liquidity?: number | null
          entry_price?: number | null
          entry_signal?: number | null
          entry_time?: string | null
          exit_price?: number | null
          exit_time?: string | null
          id?: never
          mint?: string
          pnl?: number | null
          pnl_pct?: number | null
          reason_exit?: string | null
          session?: string | null
          trade_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_trades_mint_fkey"
            columns: ["mint"]
            isOneToOne: false
            referencedRelation: "tokens_new"
            referencedColumns: ["mint"]
          },
        ]
      }
      dex_pairs: {
        Row: {
          base_token_address: string | null
          base_token_symbol: string | null
          buys_24h: number | null
          chain: string | null
          created_at: string | null
          fdv_usd: number | null
          id: string
          liquidity_usd: number | null
          pair_address: string | null
          quote_token_address: string | null
          quote_token_symbol: string | null
          sells_24h: number | null
          volume_24h_usd: number | null
        }
        Insert: {
          base_token_address?: string | null
          base_token_symbol?: string | null
          buys_24h?: number | null
          chain?: string | null
          created_at?: string | null
          fdv_usd?: number | null
          id?: string
          liquidity_usd?: number | null
          pair_address?: string | null
          quote_token_address?: string | null
          quote_token_symbol?: string | null
          sells_24h?: number | null
          volume_24h_usd?: number | null
        }
        Update: {
          base_token_address?: string | null
          base_token_symbol?: string | null
          buys_24h?: number | null
          chain?: string | null
          created_at?: string | null
          fdv_usd?: number | null
          id?: string
          liquidity_usd?: number | null
          pair_address?: string | null
          quote_token_address?: string | null
          quote_token_symbol?: string | null
          sells_24h?: number | null
          volume_24h_usd?: number | null
        }
        Relationships: []
      }
      dividend_progress: {
        Row: {
          id: number
          last_index: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          last_index?: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          last_index?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      dividends: {
        Row: {
          annual_dividend: number | null
          dividend_yield: number | null
          ex_dividend_date: string | null
          payment_date: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          annual_dividend?: number | null
          dividend_yield?: number | null
          ex_dividend_date?: string | null
          payment_date?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          annual_dividend?: number | null
          dividend_yield?: number | null
          ex_dividend_date?: string | null
          payment_date?: string | null
          ticker?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dividends_ticker_fkey"
            columns: ["ticker"]
            isOneToOne: true
            referencedRelation: "stocks"
            referencedColumns: ["ticker"]
          },
        ]
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
      positions: {
        Row: {
          closed_at: string | null
          created_at: string | null
          current_pnl_pct: number | null
          current_price: number | null
          entry_price: number | null
          highest_price: number | null
          id: string
          is_closed: boolean | null
          last_eval_at: string | null
          mint: string
          trailing_anchor: number | null
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          current_pnl_pct?: number | null
          current_price?: number | null
          entry_price?: number | null
          highest_price?: number | null
          id?: string
          is_closed?: boolean | null
          last_eval_at?: string | null
          mint: string
          trailing_anchor?: number | null
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          current_pnl_pct?: number | null
          current_price?: number | null
          entry_price?: number | null
          highest_price?: number | null
          id?: string
          is_closed?: boolean | null
          last_eval_at?: string | null
          mint?: string
          trailing_anchor?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          billing_status: string | null
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          current_period_end: string | null
          email: string | null
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
          timezone: string
          updated_at: string | null
        }
        Insert: {
          billing_status?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          current_period_end?: string | null
          email?: string | null
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
          timezone?: string
          updated_at?: string | null
        }
        Update: {
          billing_status?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          current_period_end?: string | null
          email?: string | null
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
          timezone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rpc_retry_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: number
          last_attempt: string | null
          mint: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: never
          last_attempt?: string | null
          mint: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: never
          last_attempt?: string | null
          mint?: string
        }
        Relationships: []
      }
      scoring_params: {
        Row: {
          curve_weight: number | null
          fdv_weight: number | null
          id: string
          liquidity_weight: number | null
          min_liquidity: number | null
          min_safety_score: number | null
          min_tradeable_score: number | null
          min_whale_momentum: number | null
          momentum_weight: number | null
          safety_weight: number | null
          updated_at: string | null
          volume_weight: number | null
          whale_momentum_weight: number | null
        }
        Insert: {
          curve_weight?: number | null
          fdv_weight?: number | null
          id?: string
          liquidity_weight?: number | null
          min_liquidity?: number | null
          min_safety_score?: number | null
          min_tradeable_score?: number | null
          min_whale_momentum?: number | null
          momentum_weight?: number | null
          safety_weight?: number | null
          updated_at?: string | null
          volume_weight?: number | null
          whale_momentum_weight?: number | null
        }
        Update: {
          curve_weight?: number | null
          fdv_weight?: number | null
          id?: string
          liquidity_weight?: number | null
          min_liquidity?: number | null
          min_safety_score?: number | null
          min_tradeable_score?: number | null
          min_whale_momentum?: number | null
          momentum_weight?: number | null
          safety_weight?: number | null
          updated_at?: string | null
          volume_weight?: number | null
          whale_momentum_weight?: number | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          date: string
          end_time: string | null
          id: number
          points_earned: number | null
          session: string
          start_time: string | null
          tokens_seen: number | null
          tokens_traded: number | null
        }
        Insert: {
          date: string
          end_time?: string | null
          id?: never
          points_earned?: number | null
          session: string
          start_time?: string | null
          tokens_seen?: number | null
          tokens_traded?: number | null
        }
        Update: {
          date?: string
          end_time?: string | null
          id?: never
          points_earned?: number | null
          session?: string
          start_time?: string | null
          tokens_seen?: number | null
          tokens_traded?: number | null
        }
        Relationships: []
      }
      stocks: {
        Row: {
          beta: number | null
          company: string | null
          price: number | null
          sector: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          beta?: number | null
          company?: string | null
          price?: number | null
          sector?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          beta?: number | null
          company?: string | null
          price?: number | null
          sector?: string | null
          ticker?: string
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
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          period_end: string | null
          period_start: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_lookup_key: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_lookup_key?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      SWING_bar_state: {
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
      SWING_news_state: {
        Row: {
          entry_window_percent: number | null
          entry_window_text: string | null
          hold_duration_text: string | null
          id: string
          risk_window_note: string | null
          ticker: string | null
          timestamp: string | null
        }
        Insert: {
          entry_window_percent?: number | null
          entry_window_text?: string | null
          hold_duration_text?: string | null
          id?: string
          risk_window_note?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Update: {
          entry_window_percent?: number | null
          entry_window_text?: string | null
          hold_duration_text?: string | null
          id?: string
          risk_window_note?: string | null
          ticker?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      SWING_trades_state: {
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
      token_dex: {
        Row: {
          buy_pressure: number | null
          buys: number | null
          curve_position: number | null
          fdv: number | null
          liquidity_usd: number | null
          lp_locked: boolean | null
          lp_ratio: number | null
          mint: string
          price_change_1m: number | null
          price_change_5m: number | null
          sells: number | null
          trades_5m: number | null
          updated_at: string | null
          volume_15m: number | null
          volume_1m: number | null
          volume_5m: number | null
        }
        Insert: {
          buy_pressure?: number | null
          buys?: number | null
          curve_position?: number | null
          fdv?: number | null
          liquidity_usd?: number | null
          lp_locked?: boolean | null
          lp_ratio?: number | null
          mint: string
          price_change_1m?: number | null
          price_change_5m?: number | null
          sells?: number | null
          trades_5m?: number | null
          updated_at?: string | null
          volume_15m?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
        }
        Update: {
          buy_pressure?: number | null
          buys?: number | null
          curve_position?: number | null
          fdv?: number | null
          liquidity_usd?: number | null
          lp_locked?: boolean | null
          lp_ratio?: number | null
          mint?: string
          price_change_1m?: number | null
          price_change_5m?: number | null
          sells?: number | null
          trades_5m?: number | null
          updated_at?: string | null
          volume_15m?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
        }
        Relationships: []
      }
      token_rpc: {
        Row: {
          created_at: string | null
          decimals: number | null
          freeze_authority_removed: boolean | null
          id: number
          image_exists: boolean | null
          metadata_exists: boolean | null
          metadata_valid: boolean | null
          mint: string
          mint_authority_removed: boolean | null
          supply: number | null
          token_program: string | null
        }
        Insert: {
          created_at?: string | null
          decimals?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          image_exists?: boolean | null
          metadata_exists?: boolean | null
          metadata_valid?: boolean | null
          mint: string
          mint_authority_removed?: boolean | null
          supply?: number | null
          token_program?: string | null
        }
        Update: {
          created_at?: string | null
          decimals?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          image_exists?: boolean | null
          metadata_exists?: boolean | null
          metadata_valid?: boolean | null
          mint?: string
          mint_authority_removed?: boolean | null
          supply?: number | null
          token_program?: string | null
        }
        Relationships: []
      }
      token_signals: {
        Row: {
          id: number
          mint: string
          score_buy_pressure: number | null
          score_curve: number | null
          score_liquidity: number | null
          score_risk: number | null
          score_total: number | null
          score_volume: number | null
          session: string | null
          signal_json: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: never
          mint: string
          score_buy_pressure?: number | null
          score_curve?: number | null
          score_liquidity?: number | null
          score_risk?: number | null
          score_total?: number | null
          score_volume?: number | null
          session?: string | null
          signal_json?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: never
          mint?: string
          score_buy_pressure?: number | null
          score_curve?: number | null
          score_liquidity?: number | null
          score_risk?: number | null
          score_total?: number | null
          score_volume?: number | null
          session?: string | null
          signal_json?: Json | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_signals_mint_fkey"
            columns: ["mint"]
            isOneToOne: false
            referencedRelation: "tokens_new"
            referencedColumns: ["mint"]
          },
        ]
      }
      token_snapshots: {
        Row: {
          buys_5m: number | null
          curve_position: number | null
          curve_progress: number | null
          fdv: number | null
          freeze_authority_removed: boolean | null
          id: number
          liquidity: number | null
          lp_locked: boolean | null
          mint: string
          mint_authority_removed: boolean | null
          price: number | null
          raydium_migrated: boolean | null
          sells_5m: number | null
          session: string | null
          snapshot_index: number | null
          timestamp: string | null
          trader_count: number | null
          volume_1m: number | null
          volume_5m: number | null
        }
        Insert: {
          buys_5m?: number | null
          curve_position?: number | null
          curve_progress?: number | null
          fdv?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          liquidity?: number | null
          lp_locked?: boolean | null
          mint: string
          mint_authority_removed?: boolean | null
          price?: number | null
          raydium_migrated?: boolean | null
          sells_5m?: number | null
          session?: string | null
          snapshot_index?: number | null
          timestamp?: string | null
          trader_count?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
        }
        Update: {
          buys_5m?: number | null
          curve_position?: number | null
          curve_progress?: number | null
          fdv?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          liquidity?: number | null
          lp_locked?: boolean | null
          mint?: string
          mint_authority_removed?: boolean | null
          price?: number | null
          raydium_migrated?: boolean | null
          sells_5m?: number | null
          session?: string | null
          snapshot_index?: number | null
          timestamp?: string | null
          trader_count?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "token_snapshots_mint_fkey"
            columns: ["mint"]
            isOneToOne: false
            referencedRelation: "tokens_new"
            referencedColumns: ["mint"]
          },
        ]
      }
      tokens_active: {
        Row: {
          created_at: string | null
          creator: string | null
          dex_base_token: string | null
          dex_buys_5m: number | null
          dex_chain_id: string | null
          dex_fdv_usd: number | null
          dex_liquidity_usd: number | null
          dex_pair_id: string | null
          dex_quote_token: string | null
          dex_sells_5m: number | null
          dex_volume_1h_usd: number | null
          dex_volume_24h_usd: number | null
          dex_volume_5m_usd: number | null
          id: string
          lp_wallet: string | null
          mint: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          dex_base_token?: string | null
          dex_buys_5m?: number | null
          dex_chain_id?: string | null
          dex_fdv_usd?: number | null
          dex_liquidity_usd?: number | null
          dex_pair_id?: string | null
          dex_quote_token?: string | null
          dex_sells_5m?: number | null
          dex_volume_1h_usd?: number | null
          dex_volume_24h_usd?: number | null
          dex_volume_5m_usd?: number | null
          id?: string
          lp_wallet?: string | null
          mint: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          dex_base_token?: string | null
          dex_buys_5m?: number | null
          dex_chain_id?: string | null
          dex_fdv_usd?: number | null
          dex_liquidity_usd?: number | null
          dex_pair_id?: string | null
          dex_quote_token?: string | null
          dex_sells_5m?: number | null
          dex_volume_1h_usd?: number | null
          dex_volume_24h_usd?: number | null
          dex_volume_5m_usd?: number | null
          id?: string
          lp_wallet?: string | null
          mint?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tokens_backtest_daily: {
        Row: {
          address: string | null
          id: string
          is_liquid: boolean | null
          is_safe: boolean | null
          is_tradeable: boolean | null
          liquidity: number | null
          price: number | null
          safety_score: number | null
          score_total: number | null
          timestamp_utc: string | null
          volume_24h: number | null
          whale_momentum: number | null
        }
        Insert: {
          address?: string | null
          id?: string
          is_liquid?: boolean | null
          is_safe?: boolean | null
          is_tradeable?: boolean | null
          liquidity?: number | null
          price?: number | null
          safety_score?: number | null
          score_total?: number | null
          timestamp_utc?: string | null
          volume_24h?: number | null
          whale_momentum?: number | null
        }
        Update: {
          address?: string | null
          id?: string
          is_liquid?: boolean | null
          is_safe?: boolean | null
          is_tradeable?: boolean | null
          liquidity?: number | null
          price?: number | null
          safety_score?: number | null
          score_total?: number | null
          timestamp_utc?: string | null
          volume_24h?: number | null
          whale_momentum?: number | null
        }
        Relationships: []
      }
      tokens_new: {
        Row: {
          accumulation_score: number | null
          birdeye_last_checked: string | null
          birdeye_last_updated: string | null
          bonding_curve_key: string | null
          buy_pressure: number | null
          buy_tax: number | null
          buys: number | null
          created_at: string | null
          creator_wallet: string
          curve_position: number | null
          fdv: number | null
          freeze_authority_removed: boolean | null
          id: number
          insider_cluster_count: number | null
          insider_cluster_score: number | null
          insider_risk_score: number | null
          is_active: boolean | null
          is_early: boolean | null
          is_honeypot: boolean | null
          is_liquid: boolean | null
          is_mayhem_mode: boolean | null
          is_safe: boolean | null
          is_tradeable: boolean | null
          is_trending: boolean | null
          liquidity_score: number | null
          liquidity_usd: number | null
          lp_locked: boolean | null
          lp_ratio: number | null
          market_cap_sol: number | null
          metadata_exists: boolean | null
          mint: string
          mint_authority_removed: boolean | null
          name: string | null
          pool: string | null
          price_change_1m: number | null
          price_change_5m: number | null
          price_impact: number | null
          price_impact_pct: number | null
          real_liquidity: number | null
          real_volume: number | null
          real_volume_15m: number | null
          real_volume_1m: number | null
          real_volume_5m: number | null
          score_curve: number | null
          score_liquidity: number | null
          score_momentum: number | null
          score_risk: number | null
          score_total: number | null
          score_volume: number | null
          security_score: number | null
          sell_tax: number | null
          sells: number | null
          session: string | null
          signature: string
          slippage_bps: number | null
          slippage_buy: number | null
          slippage_sell: number | null
          smart_money_count: number | null
          smart_money_inflows: number | null
          smart_money_score: number | null
          supply: number | null
          symbol: string | null
          token_program_valid: boolean | null
          top10_share: number | null
          tradeability_score: number | null
          tradeability_tier: string | null
          trades_5m: number | null
          uri: string | null
          v_sol: number | null
          v_tokens: number | null
          volume_15m: number | null
          volume_1m: number | null
          volume_5m: number | null
          volume_score: number | null
          wash_score: number | null
          wash_trading_flag: boolean | null
          whale_count: number | null
          whale_share: number | null
          whales_last_checked: string | null
        }
        Insert: {
          accumulation_score?: number | null
          birdeye_last_checked?: string | null
          birdeye_last_updated?: string | null
          bonding_curve_key?: string | null
          buy_pressure?: number | null
          buy_tax?: number | null
          buys?: number | null
          created_at?: string | null
          creator_wallet: string
          curve_position?: number | null
          fdv?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          insider_cluster_count?: number | null
          insider_cluster_score?: number | null
          insider_risk_score?: number | null
          is_active?: boolean | null
          is_early?: boolean | null
          is_honeypot?: boolean | null
          is_liquid?: boolean | null
          is_mayhem_mode?: boolean | null
          is_safe?: boolean | null
          is_tradeable?: boolean | null
          is_trending?: boolean | null
          liquidity_score?: number | null
          liquidity_usd?: number | null
          lp_locked?: boolean | null
          lp_ratio?: number | null
          market_cap_sol?: number | null
          metadata_exists?: boolean | null
          mint: string
          mint_authority_removed?: boolean | null
          name?: string | null
          pool?: string | null
          price_change_1m?: number | null
          price_change_5m?: number | null
          price_impact?: number | null
          price_impact_pct?: number | null
          real_liquidity?: number | null
          real_volume?: number | null
          real_volume_15m?: number | null
          real_volume_1m?: number | null
          real_volume_5m?: number | null
          score_curve?: number | null
          score_liquidity?: number | null
          score_momentum?: number | null
          score_risk?: number | null
          score_total?: number | null
          score_volume?: number | null
          security_score?: number | null
          sell_tax?: number | null
          sells?: number | null
          session?: string | null
          signature: string
          slippage_bps?: number | null
          slippage_buy?: number | null
          slippage_sell?: number | null
          smart_money_count?: number | null
          smart_money_inflows?: number | null
          smart_money_score?: number | null
          supply?: number | null
          symbol?: string | null
          token_program_valid?: boolean | null
          top10_share?: number | null
          tradeability_score?: number | null
          tradeability_tier?: string | null
          trades_5m?: number | null
          uri?: string | null
          v_sol?: number | null
          v_tokens?: number | null
          volume_15m?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
          volume_score?: number | null
          wash_score?: number | null
          wash_trading_flag?: boolean | null
          whale_count?: number | null
          whale_share?: number | null
          whales_last_checked?: string | null
        }
        Update: {
          accumulation_score?: number | null
          birdeye_last_checked?: string | null
          birdeye_last_updated?: string | null
          bonding_curve_key?: string | null
          buy_pressure?: number | null
          buy_tax?: number | null
          buys?: number | null
          created_at?: string | null
          creator_wallet?: string
          curve_position?: number | null
          fdv?: number | null
          freeze_authority_removed?: boolean | null
          id?: never
          insider_cluster_count?: number | null
          insider_cluster_score?: number | null
          insider_risk_score?: number | null
          is_active?: boolean | null
          is_early?: boolean | null
          is_honeypot?: boolean | null
          is_liquid?: boolean | null
          is_mayhem_mode?: boolean | null
          is_safe?: boolean | null
          is_tradeable?: boolean | null
          is_trending?: boolean | null
          liquidity_score?: number | null
          liquidity_usd?: number | null
          lp_locked?: boolean | null
          lp_ratio?: number | null
          market_cap_sol?: number | null
          metadata_exists?: boolean | null
          mint?: string
          mint_authority_removed?: boolean | null
          name?: string | null
          pool?: string | null
          price_change_1m?: number | null
          price_change_5m?: number | null
          price_impact?: number | null
          price_impact_pct?: number | null
          real_liquidity?: number | null
          real_volume?: number | null
          real_volume_15m?: number | null
          real_volume_1m?: number | null
          real_volume_5m?: number | null
          score_curve?: number | null
          score_liquidity?: number | null
          score_momentum?: number | null
          score_risk?: number | null
          score_total?: number | null
          score_volume?: number | null
          security_score?: number | null
          sell_tax?: number | null
          sells?: number | null
          session?: string | null
          signature?: string
          slippage_bps?: number | null
          slippage_buy?: number | null
          slippage_sell?: number | null
          smart_money_count?: number | null
          smart_money_inflows?: number | null
          smart_money_score?: number | null
          supply?: number | null
          symbol?: string | null
          token_program_valid?: boolean | null
          top10_share?: number | null
          tradeability_score?: number | null
          tradeability_tier?: string | null
          trades_5m?: number | null
          uri?: string | null
          v_sol?: number | null
          v_tokens?: number | null
          volume_15m?: number | null
          volume_1m?: number | null
          volume_5m?: number | null
          volume_score?: number | null
          wash_score?: number | null
          wash_trading_flag?: boolean | null
          whale_count?: number | null
          whale_share?: number | null
          whales_last_checked?: string | null
        }
        Relationships: []
      }
      tokens_pending: {
        Row: {
          contract_renounced: boolean | null
          created_at: string | null
          creator: string | null
          early_buys: number | null
          early_inflow_usd: number | null
          early_sells: number | null
          early_volume_usd: number | null
          early_whale_count: number | null
          first_seen_at: string | null
          freeze_authority_removed: boolean | null
          id: string
          insider_risk: number | null
          is_safe: boolean | null
          lp_locked: boolean | null
          lp_wallet: string | null
          mint: string
          mint_authority_removed: boolean | null
          raw_event: Json | null
          safety_score: number | null
          smart_money_count: number | null
          status: string | null
          whale_score: number | null
        }
        Insert: {
          contract_renounced?: boolean | null
          created_at?: string | null
          creator?: string | null
          early_buys?: number | null
          early_inflow_usd?: number | null
          early_sells?: number | null
          early_volume_usd?: number | null
          early_whale_count?: number | null
          first_seen_at?: string | null
          freeze_authority_removed?: boolean | null
          id?: string
          insider_risk?: number | null
          is_safe?: boolean | null
          lp_locked?: boolean | null
          lp_wallet?: string | null
          mint: string
          mint_authority_removed?: boolean | null
          raw_event?: Json | null
          safety_score?: number | null
          smart_money_count?: number | null
          status?: string | null
          whale_score?: number | null
        }
        Update: {
          contract_renounced?: boolean | null
          created_at?: string | null
          creator?: string | null
          early_buys?: number | null
          early_inflow_usd?: number | null
          early_sells?: number | null
          early_volume_usd?: number | null
          early_whale_count?: number | null
          first_seen_at?: string | null
          freeze_authority_removed?: boolean | null
          id?: string
          insider_risk?: number | null
          is_safe?: boolean | null
          lp_locked?: boolean | null
          lp_wallet?: string | null
          mint?: string
          mint_authority_removed?: boolean | null
          raw_event?: Json | null
          safety_score?: number | null
          smart_money_count?: number | null
          status?: string | null
          whale_score?: number | null
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      missed_opportunities: {
        Args: { since: string }
        Returns: {
          address: string
          pct_gain: number
        }[]
      }
      primetime_performance: {
        Args: { since: string }
        Returns: {
          gain: number
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
