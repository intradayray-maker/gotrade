"use client";

import { useEffect, useRef, useState } from "react";
import GTSlider from "@/app/components/ui/GTSlider";
import GTCard from "@/components/ui/GTCard";

import {
  initAudioUnlock,
  initBackgroundMusic,
  setMusicEnabled,
  setMusicVolume,
  enqueueAudio,
} from "app/dashboard/products/TOOLS/Ai_AudioManager";

import { getVoiceClip } from "app/dashboard/products/TOOLS/Ai_LocalVoice";

import { getBrowserSupabase } from "@/lib/supabase/browserClient";

const supabase = getBrowserSupabase();

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Trade = {
  type?: string;
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp?: string;
};

type SwingTradeRow = {
  type?: string | null;
  ticker: string | null;
  side: string | null;
  entry: number | null;
  stop: number | null;
  tp: number | null;
  timestamp?: string | null;
};

type SwingBarRow = {
  high: number | null;
  low: number | null;
  timestamp?: string | null;
};

const isSameTrade = (a: Trade | null, b: Trade) =>
  a &&
  a.ticker === b.ticker &&
  a.side === b.side &&
  a.entry === b.entry &&
  a.stop === b.stop &&
  a.tp === b.tp;

// ------------------------------------------------------------
// SUPABASE — SWING TABLES + ROW IDs
// ------------------------------------------------------------
const SWING_TRADE_ROW_ID = "81587010-c8c1-4857-a1e8-f476aa04c439";
const SWING_BAR_ROW_ID = "f5d39010-88a3-4b9c-9e3d-eb3bc2c2ce71";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function SWING_AiCard() {
  const [enabled, setEnabled] = useState(true);

  const [riskAmount, setRiskAmount] = useState(50);
  const [leverage, setLeverage] = useState(5);

  const [requiredMargin, setRequiredMargin] = useState(0);
  const [displayMargin, setDisplayMargin] = useState(0);

  const [barState, setBarState] = useState<{
    high: number;
    low: number;
    timestamp?: string;
  } | null>(null);

  const [latestTradeState, setLatestTradeState] = useState<Trade | null>(null);

  const [flashColor, setFlashColor] = useState("");
  const prevMargin = useRef(0);

  const [status, setStatus] = useState("Monitoring swing structure…");

  // ------------------------------------------------------------
  // LOCAL CLOCK ONLY (no timezone)
  // ------------------------------------------------------------
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      const local = new Date();
      setNow(local.toISOString());
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // ------------------------------------------------------------
  // AUDIO UNLOCK + LOAD SETTINGS
  // ------------------------------------------------------------
  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.53);

  useEffect(() => {
    if (typeof window === "undefined") return;

    initAudioUnlock();

    const savedRisk = localStorage.getItem("swing_dollar_risk");
    const savedLeverage = localStorage.getItem("swing_leverage");

    const savedMusicEnabled = localStorage.getItem("swing_music_enabled");
    const savedMusicVolume = localStorage.getItem("swing_music_volume");

    if (savedRisk) setRiskAmount(Number(savedRisk));
    if (savedLeverage) setLeverage(Number(savedLeverage));

    initBackgroundMusic();

    if (savedMusicVolume) {
      const vol = Number(savedMusicVolume);
      setMusicVolumeState(vol);
      setMusicVolume(vol);
    }

    if (savedMusicEnabled === "true") {
      setMusicEnabledState(true);
      setMusicEnabled(true);
    }
  }, []);

  // SAVE SETTINGS
  useEffect(() => {
    localStorage.setItem("swing_dollar_risk", String(riskAmount));
    localStorage.setItem("swing_leverage", String(leverage));
  }, [riskAmount, leverage]);

  useEffect(() => {
    localStorage.setItem("swing_music_enabled", String(musicEnabledState));
    localStorage.setItem("swing_music_volume", String(musicVolumeState));
  }, [musicEnabledState, musicVolumeState]);

  // ------------------------------------------------------------
  // SUPABASE: TRADE STATE
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("SWING_trades_state")
        .select("*")
        .eq("id", SWING_TRADE_ROW_ID)
        .single();

      if (!mounted || !data) return;

      const d = data as any;

      const t: Trade = {
        type: d.type ?? undefined,
        ticker: d.ticker ?? "",
        side: d.side ?? "",
        entry: d.entry ?? 0,
        stop: d.stop ?? 0,
        tp: d.tp ?? 0,
        timestamp: d.timestamp ?? undefined,
      };

      setLatestTradeState(t);
    };

    fetchInitial();

    const channel = supabase
      .channel("swing-ai-trade-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "SWING_trades_state",
          filter: `id=eq.${SWING_TRADE_ROW_ID}`,
        },
        (payload: { new: any }) => {
          if (!mounted || !payload.new) return;

          const d = payload.new as any;

          const t: Trade = {
            type: d.type ?? undefined,
            ticker: d.ticker ?? "",
            side: d.side ?? "",
            entry: d.entry ?? 0,
            stop: d.stop ?? 0,
            tp: d.tp ?? 0,
            timestamp: d.timestamp ?? undefined,
          };

          setLatestTradeState(t);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ------------------------------------------------------------
  // BAR STATE
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchBarState = async () => {
      const { data, error } = await supabase
        .from("SWING_bar_state")
        .select("*")
        .eq("id", SWING_BAR_ROW_ID)
        .single();

      if (!mounted || error || !data) return;

      const bar = data as any;

      setBarState({
        high: Number(bar.high) || 0,
        low: Number(bar.low) || 0,
        timestamp: bar.timestamp ?? undefined,
      });
    };

    fetchBarState();

    const channel = supabase
      .channel("swing-bar-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "SWING_bar_state",
          filter: `id=eq.${SWING_BAR_ROW_ID}`,
        },
        (payload: { new: any }) => {
          if (!mounted || !payload.new) return;

          const bar = payload.new as any;

          setBarState({
            high: Number(bar.high) || 0,
            low: Number(bar.low) || 0,
            timestamp: bar.timestamp ?? undefined,
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ------------------------------------------------------------
  // MARGIN CALCULATION
  // ------------------------------------------------------------
  const isTradeOngoing = (trade: Trade | null) =>
    trade?.type === "entry_long" || trade?.type === "entry_short";

  useEffect(() => {
    if (!barState) return;
    if (isTradeOngoing(latestTradeState)) return;

    const entry = barState.high;
    const stop = barState.low;
    const rd = Math.abs(entry - stop);
    const sz = rd > 0 ? riskAmount / rd : 0;
    const margin = leverage > 0 ? (sz * entry) / leverage : 0;

    setRequiredMargin(margin);
    localStorage.setItem("swing_required_margin", String(margin));
  }, [barState, riskAmount, leverage, latestTradeState]);

  // ------------------------------------------------------------
  // MARGIN ANIMATION
  // ------------------------------------------------------------
  useEffect(() => {
    const oldVal = prevMargin.current;
    const newVal = requiredMargin;

    if (oldVal !== newVal) {
      setFlashColor(newVal > oldVal ? "flash-red" : "flash-green");
      setTimeout(() => setFlashColor(""), 300);

      const duration = 300;
      const start = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = progress * (2 - progress);
        setDisplayMargin(oldVal + (newVal - oldVal) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      prevMargin.current = newVal;
    }
  }, [requiredMargin]);

  // ------------------------------------------------------------
  // MUSIC TOGGLE + VOLUME
  // ------------------------------------------------------------
  const toggleMusic = () => {
    const next = !musicEnabledState;
    setMusicEnabledState(next);
    setMusicEnabled(next);
  };

  const handleMusicVolume = (v: number) => {
    const vol = v / 100;
    setMusicVolumeState(vol);
    setMusicVolume(vol);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">

      {/* DATE + TIME */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {new Date(now).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {new Date(now).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* AI VOICE ASSISTANT TOGGLE */}
      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all
          ${enabled ? "shadow-[0_0_8px_rgba(0,255,180,0.15)]" : ""}
        `}
      >
        <h3 className="text-xs tracking-wide text-slate-400">
          AI VOICE ASSISTANT
        </h3>

        <div
          onClick={() => {
            const next = !enabled;
            setEnabled(next);
            setStatus(
              next ? "Monitoring swing structure…" : "Assistant disabled"
            );
          }}
          className={`
            flex h-6 w-11 cursor-pointer items-center rounded-full transition-all
            ${
              enabled
                ? "bg-[#0A4B78] shadow-[0_0_6px_rgba(0,255,180,0.35)]"
                : "bg-slate-700"
            }
          `}
        >
          <div
            className={`
              h-5 w-5 rounded-full bg-white shadow transition-all
              ${enabled ? "translate-x-5" : "translate-x-1"}
            `}
          />
        </div>
      </div>

      {/* STATUS */}
      <div className="rounded-xl border border-emerald-500/20 p-3">
        <p
          className={`
            text-sm tracking-wide transition-all
            ${
              enabled
                ? "text-[rgb(0,166,116)] drop-shadow-[0_0_4px_rgba(0,255,180,0.25)]"
                : "text-slate-500"
            }
          `}
        >
          {status}
        </p>
      </div>

      {/* RISK SLIDER */}
      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Dollar Risk Per Trade"
          value={riskAmount}
          min={1}
          max={1000}
          step={1}
          onChange={setRiskAmount}
          dollars
        />
      </div>

      {/* LEVERAGE SLIDER */}
      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Set your Leverage"
          value={leverage}
          min={1}
          max={50}
          step={1}
          onChange={setLeverage}
        />
      </div>

      {/* REQUIRED MARGIN */}
      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all duration-300
          ${flashColor === "flash-green" ? "bg-emerald-950/30" : ""}
          ${flashColor === "flash-red" ? "bg-red-950/30" : ""}
        `}
      >
        <span className="text-slate-400">Required Margin:</span>
        <span className="text-xl font-semibold text-slate-50 tabular-nums">
          ${Math.round(displayMargin).toLocaleString("en-US")}
        </span>
      </div>
    </GTCard>
  );
}
