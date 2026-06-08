"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getRandomMessageETH } from "@/TOOLS/Ai_Text";
import { setMusicEnabled, setMusicVolume } from "@/TOOLS/Ai_AudioManager";

// ------------------------------------------------------------
// MIXER FADER WITH HYBRID GLOW + POWER BUTTON
// ------------------------------------------------------------
function MixerFaderWithGlow({
  value,
  onChange,
  enabled,
  toggle,
  label
}: {
  value: number;
  onChange: (v: number) => void;
  enabled: boolean;
  toggle: () => void;
  label?: string;
}) {
  return (
    <div className="mixer-strip flex flex-col gap-3 relative">

      {/* POWER BUTTON */}
      <button
        onClick={toggle}
        className={`
          mixer-power-btn
          ${enabled ? "mixer-power-on" : "mixer-power-off"}
        `}
      >
        ⏻
      </button>

      {/* LABEL */}
      {label && (
        <div className="mixer-label">
          {label}
        </div>
      )}

      {/* SLIDER */}
      <div className="flex flex-col gap-2">

        <div className="relative w-full">
          <input
            type="range"
            className="mixer-fader-glow"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              "--fill": `${value}%`
            } as React.CSSProperties}
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
          setTimeout(() => setDone(true), 250);
        }
      };
      tick();
    }, delay);

    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return { displayed, done };
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function ETHUSDT_NewsCard() {
  // AI text (ETH-specific)
  const [aiMessage, setAiMessage] = useState(() => getRandomMessageETH());
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600);

  // Music
  const [musicEnabledState, setMusicEnabledState] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.35);

  // Volatility (for donut)
  const [volatility, setVolatility] = useState(65);

  // ------------------------------------------------------------
  // GRADIENT COLOR MATCHING FOR % TEXT
  // ------------------------------------------------------------
  const gradientColor = (() => {
    const t = volatility / 100; // 0 → 1

    const stops = [
      { r: 0, g: 150, b: 255 },   // blue
      { r: 120, g: 0, b: 255 },   // purple
      { r: 55, g: 255, b: 180 }   // greenish-pink (your final arc color)
    ];

    let idx = t * 2;
    let i = Math.floor(idx);
    let f = idx - i;

    if (i >= 2) return `rgb(${stops[2].r},${stops[2].g},${stops[2].b})`;

    const c1 = stops[i];
    const c2 = stops[i + 1];

    const r = Math.round(c1.r + (c2.r - c1.r) * f);
    const g = Math.round(c1.g + (c2.g - c1.g) * f);
    const b = Math.round(c1.b + (c2.b - c1.b) * f);

    return `rgb(${r},${g},${b})`;
  })();

  // ------------------------------------------------------------
  // Liquid Motion v2 — smooth eased drift + breathing wobble
  // ------------------------------------------------------------
  useEffect(() => {
    let target = volatility;

    const interval = setInterval(() => {
      target += (Math.random() - 0.5) * 1.2;
      target = Math.max(5, Math.min(100, target));

      setVolatility(v => {
        const eased = v + (target - v) * 0.03;
        const wobble = Math.sin(Date.now() / 600) * 0.05;
        return Math.max(5, Math.min(100, eased + wobble));
      });
    }, 240);

    return () => clearInterval(interval);
  }, []);


// Rotate ETH AI message every 10 seconds
useEffect(() => {
  const interval = setInterval(() => {
    setAiMessage((current) => {
      let next = getRandomMessageETH();
      let attempts = 0;
      while (next === current && attempts < 5) {
        next = getRandomMessageETH();
        attempts += 1;
      }
      return next;
    });
  }, 300000);

  return () => clearInterval(interval);
}, []);




  // ------------------------------------------------------------
  // LOAD MUSIC SETTINGS
  // ------------------------------------------------------------
  useEffect(() => {
    const savedVol = localStorage.getItem("ai_music_volume_eth");
    if (savedVol) {
      const vol = Number(savedVol);
      setMusicVolumeState(vol);
      setMusicVolume(vol);
    }

    const savedEnabled = localStorage.getItem("ai_music_enabled_eth");
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

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">

      {/* HEADER */}
      <p className="text-center text-xs uppercase tracking-wide text-slate-400">
        AI Market Insight
      </p>

      <div className="flex flex-1 flex-col space-y-3">

        {/* TICKER CELL */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            ETHUSDT • BINANCE
          </span>
        </div>

        {/* 🔵 DONUT v1 — VOLATILITY HEAT MAP (SMOOTH LIQUID MOTION) */}
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center flex items-center justify-center">
          <div className="relative flex items-center justify-center">

            {/* Outer pulsing glow */}
            <div
              className={`
                absolute inset-0 rounded-full
                transition-all duration-500
                ${volatility > 70 ? "animate-pulseHigh" : ""}
                ${volatility > 40 && volatility <= 70 ? "animate-pulseMed" : ""}
                ${volatility <= 40 ? "animate-pulseLow" : ""}
              `}
              style={{
                boxShadow: `
                  0 0 ${8 + volatility / 4}px rgba(0,150,255,0.35),
                  0 0 ${16 + volatility / 2}px rgba(255,0,180,0.25)
                `
              }}
            />

            {/* Donut ring — gradient arc */}
            <div
              className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: `
                  conic-gradient(
                    from 0deg,
                    rgba(0,150,255,0.9) 0%,
                    rgba(120,0,255,0.9) ${volatility * 0.4}%,
                    rgba(55,255,180,0.9) ${volatility}%,
                    rgba(40,40,60,0.4) ${volatility}%,
                    rgba(40,40,60,0.4) 100%
                  )
                `
              }}
            >
              {/* Inner cutout */}
              <div className="w-20 h-20 rounded-full bg-[#050509] flex items-center justify-center shadow-inner">
                <span
                  className="text-lg font-semibold tracking-wide transition-colors duration-300"
                  style={{ color: gradientColor }}
                >
                  {Math.round(volatility)}%
                </span>
              </div>
            </div>

          </div>
        </div>

{/* AI OUTPUT — ETH version (typing + pulsing dots) */}
<div className="rounded-xl border border-emerald-500/20 p-4 space-y-2 bg-[#050509] fade-in">

  {/* Pulsing dots */}
  <div className="flex items-center space-x-2 opacity-80">
    <div className="flex space-x-1">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-300"></span>
    </div>
    <span className="text-xs text-slate-400 tracking-wide">
      ETH Volitility Pulse…
    </span>
  </div>

  {/* Typing effect text */}
<p className="text-sm leading-relaxed text-slate-200 min-h-[40px]">
  {displayed}
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
    </GTCard>
  );
}

/* ------------------------------------------------------------
   STYLES — must be OUTSIDE the return to avoid Next.js errors
------------------------------------------------------------ */
<style jsx>{`
  @keyframes pulseHigh {
    0% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
  }
  .animate-pulseHigh {
    animation: pulseHigh 1.8s ease-in-out infinite;
  }

  @keyframes pulseMed {
    0% { transform: scale(1); opacity: 0.85; }
    50% { transform: scale(1.03); opacity: 0.95; }
    100% { transform: scale(1); opacity: 0.85; }
  }
  .animate-pulseMed {
    animation: pulseMed 2.4s ease-in-out infinite;
  }

  @keyframes pulseLow {
    0% { transform: scale(1); opacity: 0.75; }
    50% { transform: scale(1.02); opacity: 0.85; }
    100% { transform: scale(1); opacity: 0.75; }
  }
  .animate-pulseLow {
    animation: pulseLow 3.2s ease-in-out infinite;
  }

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
