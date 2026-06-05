does this sound better?

Your Personal Ai Forex Trading Assistant

instead of :


Forex Tools


if so then format correctly to put trading in the ai theme

center text

// app/dashboard/page.tsx

import ForexAiCard from "./tools/ForexAiCard";
import ForexNewsCard from "./tools/ForexNewsCard";
import ForexTradeOutputCard from "./tools/ForexTradeOutputCard";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.getUser(); // still required for gated dashboard, but no userId passed anywhere

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Forex Tools</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ForexAiCard />
        <ForexNewsCard />
        <ForexTradeOutputCard />
      </div>
    </div>
  );
}
