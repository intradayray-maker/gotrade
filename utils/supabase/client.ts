import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

/**
 * Browser-side Supabase client for use in Client Components.
 * ✔ Handles auth state in browser
 * ✔ Real-time subscriptions
 * ✔ Auto token refresh via cookies
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
