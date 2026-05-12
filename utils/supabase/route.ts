// utils/supabase/route.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/utils/supabase/config";

export function createRouteHandlerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },

      // Route Handlers cannot always write cookies (GET, HEAD, DELETE)
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Ignore write errors — this is expected in some handlers
        }
      },

      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Ignore write errors
        }
      },
    },
  });
}
