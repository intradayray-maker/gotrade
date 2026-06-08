// app/dashboard/page.tsx

import EURUSD_AiCard from "@/app/dashboard/products/EURUSD/EURUSD_AiCard";
import EURUSD_NewsCard from "@/app/dashboard/products/EURUSD/EURUSD_NewsCard";
import EURUSD_TradeOutputCard from "@/app/dashboard/products/EURUSD/EURUSD_TradeOutputCard";

import ETHUSDT_AiCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_AiCard";
import ETHUSDT_NewsCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_NewsCard";
import ETHUSDT_TradeOutputCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_TradeOutputCard";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-1 space-y-10">

      {/* HEADER */}
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
          Your Personal AI Trading Assistant
        </h1>

        <p className="text-slate-400 text-sm tracking-wide">
          Real‑time analysis, risk intelligence, and automated execution math.
        </p>
      </div>

      {/* ============================
          EURUSD SECTION
      ============================ */}
      <div className="space-y-3">
        <h2 className="text-center text-lg font-semibold text-slate-300 tracking-wide">
          EURUSD • OANDA
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <EURUSD_AiCard />
          <EURUSD_NewsCard />
          <EURUSD_TradeOutputCard />
        </div>
      </div>

      {/* ============================
          ETHUSDT SECTION
      ============================ */}
      <div className="space-y-3">
        <h2 className="text-center text-lg font-semibold text-slate-300 tracking-wide">
          ETHUSDT • BINANCE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ETHUSDT_AiCard />
          <ETHUSDT_NewsCard />
          <ETHUSDT_TradeOutputCard />
        </div>
      </div>

    </div>
  );
}
