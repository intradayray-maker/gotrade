"use client"

import { useEffect, useState } from "react"
import {
  setVoiceVolume,
  getVoiceVolume
} from "@/app/admin/demo/TOOLS/Demo_AudioManager"

export default function DemoAIVolumeSlider() {
  const [volume, setVolume] = useState(1.0)

  useEffect(() => {
    const saved = localStorage.getItem("ai_voice_volume")
    if (saved) {
      const vol = Number(saved)
      setVolume(vol)
      setVoiceVolume(vol)
    } else {
      localStorage.setItem("ai_voice_volume", "1")
      setVoiceVolume(1)
    }
  }, [])

  const handleVolume = (v: number) => {
    const vol = v / 100
    setVolume(vol)
    setVoiceVolume(vol)
    localStorage.setItem("ai_voice_volume", String(vol))
  }

  return (
    <div className="w-full rounded-xl border border-emerald-500/20 p-4 bg-[#050509] flex flex-col gap-4">

      <div className="mixer-strip">

        {/* Fader */}
<input
  type="range"
  min={0}
  max={100}
  value={volume * 100}
  onChange={(e) => handleVolume(Number(e.target.value))}
  className="mixer-fader-glow"
  style={{
    "--fill": `${volume * 100}%`,
    height: "40px"        // <— override height here
  } as any}
/>

      </div>

    </div>
  )
}
