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
import { createClient } from "@supabase/supabase-js";

type Trade = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp?: string;
};

const isSameTrade = (a: Trade | null, b: Trade) => {
  return (
    a !== null &&
    a.ticker === b.ticker &&
    a.side === b.side &&
    a.entry === b.entry &&
    a.stop === b.stop &&
    a.tp === b.tp
  );
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ForexAiCard() {
  const [enabled, setEnabled] = useState(true);

  const [riskAmount, setRiskAmount] = useState(50);
  const [leverage, setLeverage] = useState(5);

  const [requiredMargin, setRequiredMargin] = useState(0);
  const [displayMargin, setDisplayMargin] = useState(0);
  const [size, setSize] = useState(0);
  const [riskDistance, setRiskDistance] = useState(0);

  const [latestTradeState, setLatestTradeState] = useState<Trade | null>(null);

  const [flashColor, setFlashColor] = useState("");
  const prevMargin = useRef(0);

  const [status, setStatus] = useState("Listening for breakouts…");
  const [now, setNow] = useState(new Date());

  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.25);

  function formatMoney(n: number) {
    return Math.round(n).toLocaleString("en-US");
  }

  const latestTradeRef = useRef<Trade | null>(null);

  // LOAD SETTINGS
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRisk = window.localStorage.getItem("forex_dollar_risk");
    const savedLeverage = window.localStorage.getItem("forex_leverage");

    const savedMusicEnabled = window.localStorage.getItem("ai_music_enabled");
    const savedMusicVolume = window.localStorage.getItem("ai_music_volume");

    if (savedRisk !== null) setRiskAmount(Number(savedRisk));
    if (savedLeverage !== null) setLeverage(Number(savedLeverage));

    initBackgroundMusic();

    if (savedMusicVolume !== null) {
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
    window.localStorage.setItem("forex_dollar_risk", String(riskAmount));
    window.localStorage.setItem("forex_leverage", String(leverage));
  }, [riskAmount, leverage]);

  useEffect(() => {
    window.localStorage.setItem("ai_music_enabled", String(musicEnabledState));
    window.localStorage.setItem("ai_music_volume", String(musicVolumeState));
  }, [musicEnabledState, musicVolumeState]);

  // LIVE CLOCK
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // SUPABASE: INITIAL FETCH + REALTIME SUBSCRIPTION
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("trade_state")
        .select("ticker, side, entry, stop, tp, timestamp")
        .limit(1)
        .single();

      if (error || !data || !mounted) return;

      const t: Trade = {
        ticker: data.ticker,
        side: data.side,
        entry: data.entry ?? 0,
        stop: data.stop ?? 0,
        tp: data.tp ?? 0,
        timestamp: data.timestamp,
      };

      if (isSameTrade(latestTradeRef.current, t)) return;

      latestTradeRef.current = t;
      setLatestTradeState(t);
    };

    fetchInitial();

    const channel = supabase
      .channel("trade_state_realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "trade_state" },
        (payload) => {
          if (!mounted || !payload.new) return;

          const d: any = payload.new;

          const t: Trade = {
            ticker: d.ticker,
            side: d.side,
            entry: d.entry ?? 0,
            stop: d.stop ?? 0,
            tp: d.tp ?? 0,
            timestamp: d.timestamp,
          };

          if (isSameTrade(latestTradeRef.current, t)) return;

          latestTradeRef.current = t;
          setLatestTradeState(t);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // NEW TRADE DETECTION + VOICE + COOLDOWN
  const prevTradeRef = useRef<Trade | null>(null);
  const lastSpokeRef = useRef(0);
  const FLAT_COOLDOWN_MS = 240000;

  useEffect(() => {
    if (!latestTradeState || !enabled) return;

    const prev = prevTradeRef.current;

    if (
      !prev ||
      latestTradeState.timestamp === prev.timestamp ||
      isSameTrade(prev, latestTradeState)
    ) {
      prevTradeRef.current = latestTradeState;
      return;
    }

    prevTradeRef.current = latestTradeState;
    const nowMs = Date.now();
    const elapsed = nowMs - lastSpokeRef.current;

    if (latestTradeState.side === "long" || latestTradeState.side === "short") {
      enqueueAudio(
        latestTradeState.side === "long"
          ? getVoiceClip("long")
          : getVoiceClip("short")
      );
      lastSpokeRef.current = nowMs;
      return;
    }

    if (latestTradeState.side === "flat") {
      if (elapsed < FLAT_COOLDOWN_MS) return;

      enqueueAudio(getVoiceClip("flat"));
      lastSpokeRef.current = nowMs;
      return;
    }
  }, [latestTradeState, enabled]);

  // MARGIN CALCULATION
  useEffect(() => {
    if (!latestTradeState) {
      setRequiredMargin(0);
      setSize(0);
      setRiskDistance(0);
      return;
    }

    const rd = Math.abs(latestTradeState.entry - latestTradeState.stop);
    const sz = rd > 0 ? riskAmount / rd : 0;
    const margin = leverage > 0 ? (sz * latestTradeState.entry) / leverage : 0;

    setRiskDistance(rd);
    setSize(sz);
    setRequiredMargin(margin);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("forex_required_margin", String(margin));
    }
  }, [latestTradeState, riskAmount, leverage]);

  // MARGIN ANIMATION
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

  // MUSIC TOGGLE + VOLUME
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

  // UI
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
