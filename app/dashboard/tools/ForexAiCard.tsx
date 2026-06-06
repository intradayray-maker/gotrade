// app/dashboard/tools/ForexAiCard.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import GTSlider from "@/app/components/ui/GTSlider";
import GTCard from "@/components/ui/GTCard";

import {
  initBackgroundMusic,
  setMusicEnabled,
  setMusicVolume,
  enqueueAudio,
} from "./Ai_AudioManager";

import { getVoiceClip } from "./Ai_LocalVoice";

type Trade = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
};

export default function ForexAiCard() {
  const [latestTrade, setLatestTrade] = useState<Trade | null>(null);
  const prevTradeRef = useRef<Trade | null>(null);

  // cooldown only for FLAT
  const lastSpokeRef = useRef(0);
  const FLAT_COOLDOWN_MS = 240000; // 4 minutes

  // ------------------------------------------------------------
  // INIT BACKGROUND MUSIC
  // ------------------------------------------------------------
  useEffect(() => {
    initBackgroundMusic();
  }, []);

  // ------------------------------------------------------------
  // FETCH LATEST TRADE
  // ------------------------------------------------------------
  useEffect(() => {
    let active = true;

    const fetchTrade = async () => {
      try {
        const res = await fetch("/api/trade", { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        if (!active || !json.trade) return;

        const t = json.trade as Trade;

        if (
          typeof t.entry === "number" &&
          typeof t.stop === "number" &&
          typeof t.tp === "number"
        ) {
          setLatestTrade(t);
        }
      } catch (err) {
        console.error("Latest trade fetch failed:", err);
      }
    };

    fetchTrade();
    const interval = setInterval(fetchTrade, 2000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // ------------------------------------------------------------
  // AI VOICE LOGIC
  // LONG/SHORT → ALWAYS SPEAK
  // FLAT → SPEAK ONLY EVERY 4 MINUTES
  // ------------------------------------------------------------
  useEffect(() => {
    if (!latestTrade) return;

    const prev = prevTradeRef.current;
    prevTradeRef.current = latestTrade;

    if (!prev) return;

    // strict change detection
    const isNew =
      prev.ticker !== latestTrade.ticker ||
      prev.side !== latestTrade.side ||
      prev.entry !== latestTrade.entry ||
      prev.stop !== latestTrade.stop ||
      prev.tp !== latestTrade.tp;

    if (!isNew) return;

    const now = Date.now();
    const elapsed = now - lastSpokeRef.current;

    // -----------------------------------------
    // ALWAYS SPEAK on new LONG or SHORT
    // -----------------------------------------
    if (latestTrade.side === "long" || latestTrade.side === "short") {
      const clip =
        latestTrade.side === "long"
          ? getVoiceClip("long")
          : getVoiceClip("short");

      enqueueAudio(clip);
      lastSpokeRef.current = now;
      return;
    }

    // -----------------------------------------
    // FLAT MODE — speak only every 4 minutes
    // -----------------------------------------
    if (latestTrade.side === "flat") {
      if (elapsed < FLAT_COOLDOWN_MS) return;

      const clip = getVoiceClip("flat");
      enqueueAudio(clip);
      lastSpokeRef.current = now;
      return;
    }
  }, [latestTrade]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">

      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        AI Trade Assistant
      </p>

      <div className="flex flex-col space-y-3">

        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            {latestTrade?.ticker ?? "—"}
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/20 p-4 space-y-2 text-center">
          {latestTrade ? (
            <>
              <span className="block text-xl font-semibold text-emerald-400">
                {latestTrade.side.toUpperCase()}
              </span>
              <span className="block text-sm text-slate-400">
                Entry: {latestTrade.entry}
              </span>
              <span className="block text-sm text-slate-400">
                Stop: {latestTrade.stop}
              </span>
              <span className="block text-sm text-slate-400">
                TP: {latestTrade.tp}
              </span>
            </>
          ) : (
            <span className="text-slate-500 text-sm">Waiting for data…</span>
          )}
        </div>

      </div>

    </GTCard>
  );
}
