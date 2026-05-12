export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      broker_connections: {
        Row: {
          id: string;
          user_id: string | null;
          broker: string;
          api_key_id: string;
          api_secret_encrypted: string;
          paper_trading: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          broker: string;
          api_key_id: string;
          api_secret_encrypted: string;
          paper_trading?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          broker?: string;
          api_key_id?: string;
          api_secret_encrypted?: string;
          paper_trading?: boolean;
          created_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          title: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          created_at?: string;
        };
      };

      profiles: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
        };
      };

      copy_trading_settings: {
        Row: {
          user_id: string;
          allocation: number | null;
          performance_fee_rate: number | null;
        };
        Insert: {
          user_id: string;
          allocation?: number | null;
          performance_fee_rate?: number | null;
        };
        Update: {
          user_id?: string;
          allocation?: number | null;
          performance_fee_rate?: number | null;
        };
      };

      trade_queue: {
        Row: {
          id: string;
          follower_user_id: string;
          symbol: string;
          side: "buy" | "sell";
          qty: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_user_id: string;
          symbol: string;
          side: "buy" | "sell";
          qty: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_user_id?: string;
          symbol?: string;
          side?: "buy" | "sell";
          qty?: number;
          created_at?: string;
        };
      };
    };

    Enums: {};
  };
}

export type Tables<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"];

export type TablesInsert<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
