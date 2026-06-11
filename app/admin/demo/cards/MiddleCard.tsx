"use client"

import { useEffect, useState } from "react"
import GTCard from "@/components/ui/GTCard"
import { useDemoState } from "../demoState"
import { getRandomMessage } from "app/dashboard/products/TOOLS/Ai_Text"
import {
  setMusicEnabled,
  setMusicVolume,
  initBackgroundMusic,
} from "@/app/admin/demo/TOOLS/Demo_AudioManager"

// ------------------------------------------------------------
// MIXER FADER (UNCHANGED FROM REAL CARD)
// ------------------------------------------------------------
function MixerFaderWithGlow({
  value,
  onChange,
  enabled,
  toggle,
  label,
}: {
  value: number
  onChange: (v: number) => void
  enabled: boolean
  toggle: () => void
  label?: string
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
  )
}

// ------------------------------------------------------------
// TYPING EFFECT
// ------------------------------------------------------------
function useTypingEffect(text: string, speed = 28, delay = 600) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)

    let i = 0

    const start = setTimeout(() => {
      const tick = () => {
        setDisplayed(text.slice(0, i))
        i++
        if (i <= text.length) {
          setTimeout(tick, speed)
        } else {
          setDone(true)
        }
      }
      tick()
    }, delay)

    return () => clearTimeout(start)
  }, [text, speed, delay])

  return { displayed, done }
}

// ------------------------------------------------------------
// DEMO NEWS CARD (FULL EURUSD STYLE)
// ------------------------------------------------------------
export default function DemoNewsCard() {
  const { news, bar } = useDemoState()

  // ------------------------------------------------------------
  // DYNAMIC TICKER LABEL
  // ------------------------------------------------------------
  const tickerLabel =
    bar.active === "ETH"
      ? "ETHUSDT • BINANCE"
      : "EURUSD • OANDA"

  // ------------------------------------------------------------
  // DEMO VALUES
  // ------------------------------------------------------------
  const nextNewsTime = news.nextEvent || "None"
  const newsToday = news.today
  const windowActive = news.windowActive
  const countdown = news.countdown ?? 0

  const tzLabel = ""

  const cleanTime = nextNewsTime.replace("Today, ", "")
  const noEvents =
    nextNewsTime === "None" ||
    nextNewsTime === "" ||
    nextNewsTime === null

  // ------------------------------------------------------------
  // AI MESSAGE
  // ------------------------------------------------------------
  const [aiMessage] = useState(getRandomMessage())
  const { displayed, done } = useTypingEffect(aiMessage, 28, 600)

  // ------------------------------------------------------------
  // MUSIC STATE
  // ------------------------------------------------------------
  const [musicEnabledState, setMusicEnabledState] = useState(false)
  const [musicVolumeState, setMusicVolumeState] = useState(0.35)

  useEffect(() => {
    const savedVol = localStorage.getItem("ai_music_volume")
    if (savedVol) {
      const vol = Number(savedVol)
      setMusicVolumeState(vol)
      setMusicVolume(vol)
    }

    const savedEnabled = localStorage.getItem("ai_music_enabled")
    if (savedEnabled === "true") {
      setMusicEnabledState(true)
    }
  }, [])

  const toggleMusic = () => {
    const next = !musicEnabledState
    setMusicEnabledState(next)

    if (next) {
      initBackgroundMusic()
      setMusicEnabled(true)
    } else {
      setMusicEnabled(false)
    }

    localStorage.setItem("ai_music_enabled", String(next))
  }

  const handleMusicVolume = (v: number) => {
    const vol = v / 100
    setMusicVolumeState(vol)
    setMusicVolume(vol)
    localStorage.setItem("ai_music_volume", String(vol))
  }

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <GTCard className="flex h-full flex-col gap-4">

      <div className="flex flex-1 flex-col space-y-3">
        <div className="rounded-xl border border-emerald-500/20 p-3 text-center">
          <span className="text-lg font-semibold text-slate-50">
            {tickerLabel}
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
              ⚠️ Avoid Trading — Active News
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
  )
}
