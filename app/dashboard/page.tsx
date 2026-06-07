// app/dashboard/page.tsx

import ForexAiCard from "./tools/EURUSD_AiCard";
import ForexNewsCard from "./tools/EURUSD_NewsCard";
import ForexTradeOutputCard from "./tools/EURUSD_TradeOutputCard";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.getUser(); // still required for gated dashboard, but no userId passed anywhere

  return (
<div className="mx-auto max-w-6xl px-4 py-1 space-y-6">

  <div className="text-center space-y-1 pb-2">

    <h1
      className="
        text-3xl font-extrabold 
        bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400 
        text-transparent bg-clip-text 
        drop-shadow-[0_0_12px_rgba(0,200,255,0.45)]
        animate-float-slow
      "
    >
      Your Personal AI Forex Trading Assistant
    </h1>

    <p className="text-slate-400 text-sm tracking-wide">
      Powered by real‑time analysis, risk intelligence, and automated execution math.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <ForexAiCard />
    <ForexNewsCard />
    <ForexTradeOutputCard />
  </div>
</div>

  );
}
