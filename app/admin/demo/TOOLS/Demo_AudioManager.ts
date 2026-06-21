// app/admin/demo/TOOLS/Demo_AudioManager.ts

// ------------------------------------------------------------
// DEMO AUDIO ENGINE (VOICE + BACKGROUND MUSIC)
// ------------------------------------------------------------

// ------------------------------------------------------------
// VOICE QUEUE
// ------------------------------------------------------------
let queue: Array<HTMLAudioElement> = []
let isPlaying = false

// Global voice volume (0–1)
let voiceVolume = 1.0

// Ducking state
let ducked = false

// ------------------------------------------------------------
// BACKGROUND MUSIC ENGINE (DEMO)
// ------------------------------------------------------------
let bgm: HTMLAudioElement | null = null
let bgmEnabled = false
let bgmVolume = 0.35

export function initBackgroundMusic() {
  if (!bgm) {
    bgm = new Audio("/voice/bgm/backgroundMUSIC_v3.mp3")
    bgm.loop = true
    bgm.volume = bgmVolume // no fade on first play
  }
}

export function setMusicEnabled(v: boolean) {
  bgmEnabled = v
  if (!bgm) return

  if (v) {
    // INSTANT start — no fade
    bgm.volume = bgmVolume
    bgm.play().catch(() => {})
  } else {
    bgm.pause()
  }
}

export function setMusicVolume(v: number) {
  bgmVolume = v
  if (!bgm) return
  bgm.volume = v
}

// ------------------------------------------------------------
// AUDIO UNLOCK (REQUIRED BY BROWSERS)
// ------------------------------------------------------------
let audioUnlocked = false

export function initDemoAudioUnlock() {
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

    // Resume queued voice
    playNext()

    // Resume music if enabled
    if (bgmEnabled && bgm) {
      bgm.play().catch(() => {})
    }
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
// SMOOTH DUCKING (FADE DOWN + CINEMATIC FADE UP)
// ------------------------------------------------------------
let duckFadeInterval: any = null
let unduckFadeInterval: any = null

function duckMusic() {
  if (!bgm || !bgmEnabled) return
  if (ducked) return
  ducked = true

  clearInterval(unduckFadeInterval)

  const target = bgmVolume * 0.25
  const steps = 12           // 180ms fade-down
  const step = (bgm.volume - target) / steps

  duckFadeInterval = setInterval(() => {
    if (!bgm) return
    const next = bgm.volume - step
    if (next <= target) {
      bgm.volume = target
      clearInterval(duckFadeInterval)
    } else {
      bgm.volume = next
    }
  }, 15)
}

function unduckMusic() {
  if (!bgm || !bgmEnabled) return
  if (!ducked) return
  ducked = false

  clearInterval(duckFadeInterval)

  const target = bgmVolume
  const steps = 50           // 500ms fade-up (cinematic)
  const step = (target - bgm.volume) / steps

  unduckFadeInterval = setInterval(() => {
    if (!bgm) return
    const next = bgm.volume + step
    if (next >= target) {
      bgm.volume = target
      clearInterval(unduckFadeInterval)
    } else {
      bgm.volume = next
    }
  }, 25)
}

// ------------------------------------------------------------
// VOICE QUEUE
// ------------------------------------------------------------
export function enqueueDemoAudio(audio: HTMLAudioElement) {
  audio.volume = voiceVolume
  queue.push(audio)
  playNext()
}

function playNext() {
  if (isPlaying) return
  if (queue.length === 0) return

  // Wait for unlock
  if (!audioUnlocked) return

  isPlaying = true
  const audio = queue.shift()!

  audio.volume = voiceVolume

  duckMusic()

  audio.onended = () => {
    isPlaying = false
    unduckMusic()
    playNext()
  }

  audio.play().catch(err => {
    console.error("Demo audio playback failed:", err)
    isPlaying = false
    unduckMusic()
    playNext()
  })
}
