// utils\supabase\route.ts


import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types";

/**
 * Route Handler client for Supabase.
 * ✔ Async cookies() support
 * ✔ Safe cookie write guards
 * ✔ Compatible with all HTTP methods
 */
export async function createRouteHandlerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            // Route Handlers cannot always write cookies (GET, HEAD, DELETE)
            console.debug(`[Supabase] Cookie set suppressed in Route Handler: ${name}`);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (e) {
            console.debug(`[Supabase] Cookie remove suppressed in Route Handler: ${name}`);
          }
        },
      },
    }
  );
}
