// app/dashboard/tools/Ai_AudioManager.ts

// ------------------------------------------------------------
// GLOBAL AUDIO STATE (VOICE-ONLY ENGINE)
// ------------------------------------------------------------
let queue: Array<HTMLAudioElement> = []
let isPlaying = false

// Voice volume (0–1)
let voiceVolume = 1.0

// Ducking state (for future background music)
let ducked = false

// ------------------------------------------------------------
// AUDIO UNLOCK (REQUIRED BY BROWSERS)
// ------------------------------------------------------------
let audioUnlocked = false

export function initAudioUnlock() {
  if (audioUnlocked) return

  const unlock = () => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
      const buffer = ctx.createBuffer(1, 1, 22050)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start(0)
    } catch {}

    audioUnlocked = true
    window.removeEventListener("click", unlock)
  }

  window.addEventListener("click", unlock)
}

// ------------------------------------------------------------
// VOICE VOLUME CONTROL
// ------------------------------------------------------------
export function setVoiceVolume(vol: number) {
  voiceVolume = vol
  localStorage.setItem("ai_voice_volume", String(vol))
}

export function getVoiceVolume() {
  return voiceVolume
}

// ------------------------------------------------------------
// DUCKING (FUTURE MUSIC SUPPORT)
// ------------------------------------------------------------
function duckMusic() {
  // No background music yet — but keep logic for future use
  ducked = true
}

function unduckMusic() {
  ducked = false
}

// ------------------------------------------------------------
// VOICE QUEUE
// ------------------------------------------------------------
export function enqueueAudio(audio: HTMLAudioElement) {
  // Apply global voice volume
  audio.volume = voiceVolume

  queue.push(audio)
  playNext()
}

function playNext() {
  if (isPlaying) return
  if (queue.length === 0) return

  // DO NOT CLEAR QUEUE — wait for unlock
  if (!audioUnlocked) return

  isPlaying = true
  const audio = queue.shift()!

  // Apply volume again (safety)
  audio.volume = voiceVolume

  duckMusic()

  audio.onended = () => {
    isPlaying = false
    unduckMusic()
    playNext()
  }

  audio.play().catch(err => {
    console.error("Audio playback failed:", err)
    isPlaying = false
    unduckMusic()
    playNext()
  })
}
