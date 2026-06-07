// app/dashboard/tools/ForexNewsCard.tsx

"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import GTSlider from "@/app/components/ui/GTSlider";

import { getRandomMessage } from "./Ai_Text";
import { setMusicEnabled, setMusicVolume } from "./Ai_AudioManager";

import { useTradeStore, TradeStore } from "./useTradeStore";
import { useTradePolling } from "./useTradePolling";

// ------------------------------------------------------------
// TYPING EFFECT
// ------------------------------------------------------------
function useTypingEffect(text: string, speed = 35, delay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let i = 0;

    const start = setTimeout(() => {
      const tick = () => {
        setDisplayed(text.slice(0, i));
        i++;
        if (i <= text.length) {
          setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      tick();
    }, delay);

    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return { displayed, done };
}

export default function ForexNewsCard() {
  // Start shared polling once
  useTradePolling();

  // Typed Zustand selector
  const trade = useTradeStore((s: TradeStore) => s.trade);

  const [nextNewsTime, setNextNewsTime] = useState("None");
  const [newsToday, setNewsToday] = useState(false);
  const [windowActive, setWindowActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [aiMessage] = useState(getRandomMessage());
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600);

  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.25);

  // Load music settings
  useEffect(() => {
    const savedVol = localStorage.getItem("ai_music_volume");
    if (savedVol) {
      const vol = Number(savedVol);
      setMusicVolumeState(vol);
      setMusicVolume(vol);
    }

    const savedEnabled = localStorage.getItem("ai_music_enabled");
    if (savedEnabled === "true") {
      setMusicEnabledState(true);
      setMusicEnabled(true);
    }
  }, []);

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

  // React to shared trade updates
  useEffect(() => {
    if (!trade) return;

    setNextNewsTime(trade.next_news_time ?? "None");
    setNewsToday(Boolean(trade.news_today));
    setWindowActive(Boolean(trade.news_window_active));
    setCountdown(Number(trade.news_countdown ?? 0));
  }, [trade]);

  const cleanTime = nextNewsTime.replace("Today, ", "");

  const noEvents =
    nextNewsTime === "None" ||
    nextNewsTime === "" ||
    nextNewsTime === null;

  return (
    <GTCard className="flex h-full flex-col gap-4">

      {/* Header */}
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily News Status
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* Ticker */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            EURUSD • OANDA
          </span>
        </div>

        {/* NEWS CELL */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">

          {newsToday && countdown > 0 && (
            <>
              <span className="block text-xl font-semibold text-red-400">
                ⚠️ NEWS TODAY
              </span>
              <span className="block text-lg font-semibold text-slate-50">
                {cleanTime} est
              </span>
            </>
          )}

          {newsToday && countdown === 0 && (
            <>
              <span className="block text-xl font-semibold text-red-400">
                ⚠️ NEWS WAS TODAY
              </span>
              <span className="block text-lg font-semibold text-slate-50">
                Occurred at {cleanTime} est
              </span>
              <span className="block text-sm text-red-300 italic">
                {noEvents
                  ? "No upcoming events scheduled"
                  : `next event: ${nextNewsTime} est`}
              </span>
            </>
          )}

          {!newsToday && (
            <>
              <span className="block text-xl font-semibold text-emerald-400">
                ✓ No News Today
              </span>
              <span className="block text-sm text-slate-400 italic">
                {noEvents
                  ? "No upcoming events scheduled"
                  : `next event: ${nextNewsTime} est`}
              </span>
            </>
          )}

        </div>

        {/* SAFE / UNSAFE */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          {windowActive ? (
            <span className="block text-lg font-semibold text-red-400">
              ⚠️ Avoid trading — news window active
            </span>
          ) : (
            <span className="block text-lg font-semibold text-emerald-400">
              🟢 Safe to take trades
            </span>
          )}
        </div>

        {/* AI OUTPUT */}
        <div className="rounded-xl border border-emerald-500/20 p-4 space-y-3 bg-[#050509]">
          <div className="flex items-center space-x-2 opacity-80">
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-300"></span>
            </div>
            <span className="text-xs text-slate-400 tracking-wide">
              AI is reflecting…
            </span>
          </div>

          <p className="text-sm leading-relaxed text-slate-200 min-h-[48px] fade-in">
            {displayed}
            {!done && <span className="ml-1 animate-pulse">▌</span>}
            {done && <span className="ml-1 animate-blink">▌</span>}
          </p>
        </div>

        {/* MUSIC CONTROL */}
        <div className="rounded-xl border border-emerald-500/20 p-4 space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 tracking-wide">
              Deep Focus Mode
            </span>

            <button
              onClick={toggleMusic}
              className={`
                px-3 py-1 rounded-lg text-xs font-semibold transition-all
                ${
                  musicEnabledState
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-slate-700/30 text-slate-400 border border-slate-600/40"
                }
              `}
            >
              {musicEnabledState}
            </button>
          </div>

          {musicEnabledState && (
            <GTSlider
              title="Atmosphere Level"
              value={musicVolumeState * 100}
              min={0}
              max={100}
              step={1}
              onChange={handleMusicVolume}
            />
          )}

        </div>

      </div>

      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 1.2s infinite;
        }
        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </GTCard>
  );
}
