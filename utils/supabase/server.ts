//utils\supabase\server.ts

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types";

/**
 * Next.js 16 server client for Supabase.
 * ✔ Async cookies() support
 * ✔ RSC + Route Handler compatible
 * ✔ Stable cookie adapter
 */
export async function createSupabaseServerClient() {
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
            // Next.js 16: Silently fails in Server Components during read
            console.debug(`[Supabase] Cookie set suppressed: ${name}`);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (e) {
            console.debug(`[Supabase] Cookie remove suppressed: ${name}`);
          }
        },
      },
    }
  );
}
