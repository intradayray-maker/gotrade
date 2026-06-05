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

  <div className="text-center space-y-1 pb-2">
    <div className="flex justify-center">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 
                      flex items-center justify-center shadow-[0_0_20px_rgba(0,200,255,0.45)]
                      animate-float">
        <span className="text-white text-xl font-bold">AI</span>
      </div>
    </div>

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
