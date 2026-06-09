"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient()(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestClient() {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("trade_state")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => setState(data));

    const channel = supabase
      .channel("trade_state_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "trade_state" },
        (payload) => {
          setState(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const side = state?.side ?? "flat";

  return (
    <div className="space-y-6">
      <div className="text-xl">
        Current State:{" "}
        <span
          className={
            side === "long"
              ? "text-emerald-400"
              : side === "short"
              ? "text-red-400"
              : "text-slate-400"
          }
        >
          {side}
        </span>
      </div>
    </div>
  );
}
