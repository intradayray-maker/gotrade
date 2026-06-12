//  app\dashboard\products\EURUSD\EURUSD_NewsCard.tsx


"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getRandomMessage } from "app/dashboard/products/TOOLS/Ai_Text";
import {
  setMusicEnabled,
  setMusicVolume,
  initBackgroundMusic,
} from "app/dashboard/products/TOOLS/Ai_AudioManager";

import { getBrowserSupabase } from "@/lib/supabase/browserClient";
import { formatInTimeZone } from "date-fns-tz";

const supabase = getBrowserSupabase();

// ------------------------------------------------------------
// SHORT TIMEZONE LABELS
// ------------------------------------------------------------
const getShortTZ = (tz: string) => {
  if (tz === "America/New_York") return "ET";
  if (tz === "America/Chicago") return "CT";
  if (tz === "America/Denver") return "MT";
  if (tz === "America/Los_Angeles") return "PT";
  return tz.split("/")[1]?.replace("_", " ") || tz;
};

// ------------------------------------------------------------
// MIXER FADER
// ------------------------------------------------------------
function MixerFaderWithGlow({
  value,
  onChange,
  enabled,
  toggle,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  enabled: boolean;
  toggle: () => void;
  label?: string;
}) {
  return (
    <div className="mixer-strip flex flex-col gap-3 relative">
      <button
        onClick={toggle}
        className={`mixer-power-btn ${
          enabled ? "mixer-power-on" : "mixer-power-off"
        }`}
      >
        ⏻
      </button>

      {label && <div className="mixer-label">{label}</div>}

      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <input
            type="range"
            className="mixer-fader-glow"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ "--fill": `${value}%` } as React.CSSProperties}
          />
        </div>

        <div className="mixer-ticks">
          <div className="mixer-tick"></div>
          <div className="mixer-tick"></div>
          <div className="mixer-tick"></div>
          <div className="mixer-tick"></div>
          <div className="mixer-tick"></div>
        </div>
      </div>
    </div>
  );
}

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

// ------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------
const EURUSD_NEWS_ROW_ID = "d1c4f448-a9f9-4938-ac75-14398ee7aa40";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function EURUSD_NewsCard() {
  const [nextNewsTime, setNextNewsTime] = useState("None");
  const [newsToday, setNewsToday] = useState(false);
  const [windowActive, setWindowActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [aiMessage] = useState(getRandomMessage());
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600);

  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.35);

  // ------------------------------------------------------------
  // USER TIMEZONE
  // ------------------------------------------------------------
  const [userTimezone, setUserTimezone] = useState("America/New_York");
  const tzLabel = getShortTZ(userTimezone);

  useEffect(() => {
    const loadTimezone = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*, timezone")
        .eq("id", user.id)
        .single();

      if (profile?.timezone) {
        setUserTimezone(profile.timezone);
      }
    };

    loadTimezone();
  }, []);

  // ------------------------------------------------------------
  // LOAD MUSIC SETTINGS (NO AUTOPLAY)
  // ------------------------------------------------------------
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
    }
  }, []);

  const toggleMusic = () => {
    const next = !musicEnabledState;
    setMusicEnabledState(next);

    if (next) {
      initBackgroundMusic();
      setMusicEnabled(true);
    } else {
      setMusicEnabled(false);
    }

    localStorage.setItem("ai_music_enabled", String(next));
  };

  const handleMusicVolume = (v: number) => {
    const vol = v / 100;
    setMusicVolumeState(vol);
    setMusicVolume(vol);
    localStorage.setItem("ai_music_volume", String(vol));
  };

  // ------------------------------------------------------------
  // SUPABASE: INITIAL FETCH + REALTIME (timezone-aware)
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const convertTime = (t: string | null) => {
      if (!t || t === "None") return "None";
      try {
        return formatInTimeZone(new Date(t), userTimezone, "h:mm a");
      } catch {
        return t;
      }
    };

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("EURUSD_news_state")
        .select(
          "next_news_time, news_today, news_window_active, news_countdown"
        )
        .eq("id", EURUSD_NEWS_ROW_ID)
        .single();

      if (!mounted || error || !data) return;

      setNextNewsTime(convertTime(data.next_news_time));
      setNewsToday(Boolean(data.news_today));
      setWindowActive(Boolean(data.news_window_active));
      setCountdown(Number(data.news_countdown ?? 0));
    };

    fetchInitial();

    const channel = supabase
      .channel("eurusd-news-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "EURUSD_news_state",
          filter: `id=eq.${EURUSD_NEWS_ROW_ID}`,
        },
        (payload: { new: Record<string, any> }) => {
          if (!mounted || !payload.new) return;

          const d = payload.new;

          setNextNewsTime(convertTime(d.next_news_time));
          setNewsToday(Boolean(d.news_today));
          setWindowActive(Boolean(d.news_window_active));
          setCountdown(Number(d.news_countdown ?? 0));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userTimezone]);

  // ------------------------------------------------------------
  // CLEAN TIME
  // ------------------------------------------------------------
  const cleanTime = nextNewsTime.replace("Today, ", "");

  const noEvents =
    nextNewsTime === "None" ||
    nextNewsTime === "" ||
    nextNewsTime === null;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        Daily News Status
      </p>

      <div className="flex flex-1 flex-col space-y-3">
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            EURUSD • OANDA
          </span>
        </div>

        {/* NEWS CELL */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center space-y-1">

          {/* NEWS TODAY + COUNTDOWN ACTIVE */}
          {newsToday && countdown > 0 && (
            <>
              <span className="block text-xl font-semibold text-red-400">
                ⚠️ NEWS TODAY
              </span>
              <span className="block text-lg font-semibold text-slate-50">
                {cleanTime} {tzLabel}
              </span>
            </>
          )}

          {/* NEWS TODAY BUT COUNTDOWN FINISHED */}
          {newsToday && countdown === 0 && (
            <>
              <span className="block text-xl font-semibold text-red-400">
                ⚠️ NEWS WAS TODAY
              </span>
              <span className="block text-lg font-semibold text-slate-50">
                Occurred at {cleanTime} {tzLabel}
              </span>
              <span className="block text-sm text-red-300 italic">
                {noEvents
                  ? "No upcoming events scheduled"
                  : `next event: ${nextNewsTime} ${tzLabel}`}
              </span>
            </>
          )}

          {/* NO NEWS TODAY */}
          {!newsToday && (
            <>
              <span className="block text-xl font-semibold text-emerald-400">
                ✓ No News Today
              </span>
              <span className="block text-sm text-slate-400 italic">
                {noEvents
                  ? "No upcoming events scheduled"
                  : `next event: ${nextNewsTime} ${tzLabel}`}
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
        <div className="relative rounded-xl border border-emerald-500/20 p-4 pb-10 space-y-4">
          <MixerFaderWithGlow
            label="Deep Focus Music"
            value={musicVolumeState * 100}
            onChange={handleMusicVolume}
            enabled={musicEnabledState}
            toggle={toggleMusic}
          />
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
