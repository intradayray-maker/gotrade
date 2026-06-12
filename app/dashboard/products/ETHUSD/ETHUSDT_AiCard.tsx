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
import { formatInTimeZone } from "date-fns-tz";

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

const isTradeOngoing = (trade: Trade | null) =>
  trade?.type === "entry_long" || trade?.type === "entry_short";

// ------------------------------------------------------------
// SUPABASE ROW IDS
// ------------------------------------------------------------
const ETH_TRADE_ROW_ID = "0fee5c83-f233-4487-bc5f-f7e703a14024";
const ETH_BAR_ROW_ID = "530ef4a6-e3be-4c19-b34e-1d84062170cb";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function ETHUSDT_AiCard() {
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

  const prevMargin = useRef(0);
  const [flashColor, setFlashColor] = useState("");

  const [status, setStatus] = useState("Listening for breakouts…");

  // ------------------------------------------------------------
  // USER TIMEZONE
  // ------------------------------------------------------------
  const [userTimezone, setUserTimezone] = useState("America/New_York");

  useEffect(() => {
    const loadTimezone = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const p = profile as any;

      if (p?.timezone) {
        setUserTimezone(p.timezone);
      }
    };

    loadTimezone();
  }, []);

  // ------------------------------------------------------------
  // LIVE CLOCK (timezone-aware)
  // ------------------------------------------------------------
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      const local = new Date();
      const formatted = formatInTimeZone(
        local,
        userTimezone,
        "yyyy-MM-dd HH:mm:ss"
      );
      setNow(formatted);
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [userTimezone]);

  // ------------------------------------------------------------
  // AUDIO UNLOCK + LOAD SETTINGS
  // ------------------------------------------------------------
  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.53);

  const formatMoney = (n: number) =>
    Math.round(n).toLocaleString("en-US");

  useEffect(() => {
    if (typeof window === "undefined") return;

    initAudioUnlock();

    const savedRisk = localStorage.getItem("eth_dollar_risk");
    const savedLeverage = localStorage.getItem("eth_leverage");

    const savedMusicEnabled = localStorage.getItem("ai_music_enabled_eth");
    const savedMusicVolume = localStorage.getItem("ai_music_volume_eth");

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

  useEffect(() => {
    localStorage.setItem("eth_dollar_risk", String(riskAmount));
    localStorage.setItem("eth_leverage", String(leverage));
  }, [riskAmount, leverage]);

  useEffect(() => {
    localStorage.setItem("ai_music_enabled_eth", String(musicEnabledState));
    localStorage.setItem("ai_music_volume_eth", String(musicVolumeState));
  }, [musicEnabledState, musicVolumeState]);

  // ------------------------------------------------------------
  // SUPABASE: TRADE STATE (timezone-aware)
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("ETHUSDT_trades_state")
        .select("*")
        .eq("id", ETH_TRADE_ROW_ID)
        .single();

      if (!mounted || !data) return;

      const d = data as any;

      setLatestTradeState({
        type: d.type ?? undefined,
        ticker: d.ticker ?? "",
        side: d.side ?? "",
        entry: d.entry ?? 0,
        stop: d.stop ?? 0,
        tp: d.tp ?? 0,
        timestamp: d.timestamp
          ? formatInTimeZone(
              new Date(d.timestamp),
              userTimezone,
              "yyyy-MM-dd HH:mm:ss"
            )
          : undefined,
      });
    };

    fetchInitial();

    const channelName = `ethusdt-ai-trade-realtime-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ETHUSDT_trades_state",
          filter: `id=eq.${ETH_TRADE_ROW_ID}`,
        },
        (payload: { new: any }) => {
          if (!mounted || !payload.new) return;

          const d = payload.new as any;

          setLatestTradeState({
            type: d.type ?? undefined,
            ticker: d.ticker ?? "",
            side: d.side ?? "",
            entry: d.entry ?? 0,
            stop: d.stop ?? 0,
            tp: d.tp ?? 0,
            timestamp: d.timestamp
              ? formatInTimeZone(
                  new Date(d.timestamp),
                  userTimezone,
                  "yyyy-MM-dd HH:mm:ss"
                )
              : undefined,
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userTimezone]);

  // ------------------------------------------------------------
  // AI VOICE LOGIC
  // ------------------------------------------------------------
  const prevEventRef = useRef<string | null>(null);

  useEffect(() => {
    if (!latestTradeState || !enabled) return;

    const eventType = latestTradeState.type;
    if (!eventType) return;

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
  }, [latestTradeState, enabled]);

  // ------------------------------------------------------------
  // BAR STATE + MARGIN CALC (timezone-aware)
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchBarState = async () => {
      const { data, error } = await supabase
        .from("ETHUSDT_bar_state")
        .select("*")
        .eq("id", ETH_BAR_ROW_ID)
        .single();

      if (!mounted || error || !data) return;

      const bar = data as any;

      setBarState({
        high: Number(bar.high ?? 0),
        low: Number(bar.low ?? 0),
        timestamp: bar.timestamp
          ? formatInTimeZone(
              new Date(bar.timestamp),
              userTimezone,
              "yyyy-MM-dd HH:mm:ss"
            )
          : undefined,
      });
    };

    fetchBarState();

    const barChannelName = `ethusdt-bar-realtime-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(barChannelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ETHUSDT_bar_state",
          filter: `id=eq.${ETH_BAR_ROW_ID}`,
        },
        (payload: { new: any }) => {
          if (!mounted || !payload.new) return;

          const bar = payload.new as any;

          setBarState({
            high: Number(bar.high ?? 0),
            low: Number(bar.low ?? 0),
            timestamp: bar.timestamp
              ? formatInTimeZone(
                  new Date(bar.timestamp),
                  userTimezone,
                  "yyyy-MM-dd HH:mm:ss"
                )
              : undefined,
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userTimezone]);

  // ------------------------------------------------------------
  // MARGIN CALCULATION
  // ------------------------------------------------------------
  useEffect(() => {
    if (!barState) return;
    if (isTradeOngoing(latestTradeState)) return;

    const entry = barState.high;
    const stop = barState.low;
    const rd = Math.abs(entry - stop);
    const sz = rd > 0 ? riskAmount / rd : 0;
    const margin = leverage > 0 ? (sz * entry) / leverage : 0;

    setRequiredMargin(margin);
    localStorage.setItem("eth_required_margin", String(margin));
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
              next ? "Listening for breakouts…" : "Assistant disabled"
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

      {/* LEVERAGE SLIDER (ETH max = 20x) */}
      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Set your Leverage"
          value={leverage}
          min={1}
          max={20}
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
