// app/dashboard/page.tsx

import ForexAiCard from "./tools/ForexAiCard";
import ForexNewsCard from "./tools/ForexNewsCard";
import ForexTradeOutputCard from "./tools/ForexTradeOutputCard";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Forex Tools</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* PASS THE REAL USER ID */}
        <ForexAiCard userId={user?.id ?? null} />

        <ForexNewsCard userId={user?.id ?? null} />

        <ForexTradeOutputCard userId={user?.id ?? null} />
      </div>
    </div>
  );
}
