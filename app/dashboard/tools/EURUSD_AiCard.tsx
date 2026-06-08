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
import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Trade = {
  type?: string; // entry_long, entry_short, sl, tp, bar, news
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp?: string;
};

const isSameTrade = (a: Trade | null, b: Trade) =>
  a &&
  a.ticker === b.ticker &&
  a.side === b.side &&
  a.entry === b.entry &&
  a.stop === b.stop &&
  a.tp === b.tp;

// ------------------------------------------------------------
// SUPABASE
// ------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EURUSD_TRADE_ROW_ID = "5726f12d-46d7-4e03-8131-a1febfd7ae42";
const EURUSD_BAR_ROW_ID = "87b8c55f-52c7-4824-9fc7-98febbbdb02d";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function EURUSD_AiCard() {
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

  const [status, setStatus] = useState("Listening for breakouts…");
  const [now, setNow] = useState(new Date());

  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.25);

  const formatMoney = (n: number) =>
    Math.round(n).toLocaleString("en-US");

  // ------------------------------------------------------------
  // LOAD SETTINGS
  // ------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRisk = localStorage.getItem("forex_dollar_risk");
    const savedLeverage = localStorage.getItem("forex_leverage");

    const savedMusicEnabled = localStorage.getItem("ai_music_enabled");
    const savedMusicVolume = localStorage.getItem("ai_music_volume");

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
    localStorage.setItem("forex_dollar_risk", String(riskAmount));
    localStorage.setItem("forex_leverage", String(leverage));
  }, [riskAmount, leverage]);

  useEffect(() => {
    localStorage.setItem("ai_music_enabled", String(musicEnabledState));
    localStorage.setItem("ai_music_volume", String(musicVolumeState));
  }, [musicEnabledState, musicVolumeState]);

  // LIVE CLOCK
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ------------------------------------------------------------
  // SUPABASE: TRADE STATE
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("EURUSD_trades_state")
        .select("type, ticker, side, entry, stop, tp, timestamp")
        .eq("id", EURUSD_TRADE_ROW_ID)
        .single();

      if (!mounted || !data) return;

      const t: Trade = {
        type: data.type,
        ticker: data.ticker,
        side: data.side,
        entry: data.entry ?? 0,
        stop: data.stop ?? 0,
        tp: data.tp ?? 0,
        timestamp: data.timestamp,
      };

      setLatestTradeState(t);
    };

    fetchInitial();

    const channel = supabase
      .channel("eurusd-ai-trade-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "EURUSD_trades_state",
          filter: `id=eq.${EURUSD_TRADE_ROW_ID}`,
        },
        (payload) => {
          if (!mounted || !payload.new) return;

          const d = payload.new;

          const t: Trade = {
            type: d.type,
            ticker: d.ticker,
            side: d.side,
            entry: d.entry ?? 0,
            stop: d.stop ?? 0,
            tp: d.tp ?? 0,
            timestamp: d.timestamp,
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
  // AI VOICE LOGIC — EXPLICIT EVENT TYPES
  // ------------------------------------------------------------
  const prevEventRef = useRef<string | null>(null);

  useEffect(() => {
    if (!latestTradeState || !enabled) return;

    const eventType = latestTradeState.type;
    if (!eventType) return;

    // Prevent duplicate triggers
    if (prevEventRef.current === eventType) return;
    prevEventRef.current = eventType;

    if (eventType === "entry_long") {
      enqueueAudio(getVoiceClip("long"));
      return;
    }

    if (eventType === "entry_short") {
      enqueueAudio(getVoiceClip("short"));
      return;
    }

    if (eventType === "tp") {
      enqueueAudio(getVoiceClip("tp"));
      return;
    }

    if (eventType === "sl") {
      enqueueAudio(getVoiceClip("sl"));
      return;
    }

    // Ignore: bar, news, flat, heartbeat
  }, [latestTradeState, enabled]);

  // ------------------------------------------------------------
  // BAR STATE MARGIN CALCULATION
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchBarState = async () => {
      const { data, error } = await supabase
        .from("EURUSD_bar_state")
        .select("high, low, timestamp")
        .eq("id", EURUSD_BAR_ROW_ID)
        .single();

      if (!mounted || error || !data) return;

      setBarState({
        high: Number(data.high) || 0,
        low: Number(data.low) || 0,
        timestamp: data.timestamp,
      });
    };

    fetchBarState();

    const channel = supabase
      .channel("eurusd-bar-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "EURUSD_bar_state",
          filter: `id=eq.${EURUSD_BAR_ROW_ID}`,
        },
        (payload) => {
          if (!mounted || !payload.new) return;

          const bar = payload.new;
          setBarState({
            high: Number(bar.high) || 0,
            low: Number(bar.low) || 0,
            timestamp: bar.timestamp,
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!barState) return;

    const entry = barState.high;
    const stop = barState.low;
    const rd = Math.abs(entry - stop);
    const sz = rd > 0 ? riskAmount / rd : 0;
    const margin = leverage > 0 ? (sz * entry) / leverage : 0;

    setRequiredMargin(margin);
    localStorage.setItem("forex_required_margin", String(margin));
  }, [barState, riskAmount, leverage]);

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
            {now.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {now.toLocaleTimeString("en-US", {
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
              next ? "Listening for breakouts…" : "Assistant disabled"
            );
          }}
          className={`
            flex h-6 w-11 cursor-pointer items-center rounded-full transition-all
            ${
              enabled
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(0,255,180,0.35)]"
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
                ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
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
          ${formatMoney(displayMargin)}
        </span>
      </div>
    </GTCard>
  );
}
