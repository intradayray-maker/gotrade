// app/dashboard/tools/Ai_AudioManager.ts

// ------------------------------------------------------------
// GLOBAL AUDIO STATE
// ------------------------------------------------------------
let queue: Array<HTMLAudioElement> = []
let isPlaying = false

let music: HTMLAudioElement | null = null
let musicEnabled = true
let musicVolume = 0.35
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

    // ⭐ Start music instantly after unlock if enabled
    if (music && musicEnabled) {
      music.volume = musicVolume
      music.play().catch(() => {})
    }

    window.removeEventListener("click", unlock)
  }

  window.addEventListener("click", unlock)
}

// ------------------------------------------------------------
// INIT MUSIC ENGINE (NO MUSIC FADES)
// ------------------------------------------------------------
export function initBackgroundMusic() {
  if (music) return

  music = new Audio("/voice/bgm/backgroundMUSIC_v3.mp3")
  music.loop = true
  music.volume = musicVolume

  const savedEnabled = localStorage.getItem("ai_music_enabled")
  const savedVolume = localStorage.getItem("ai_music_volume")

  if (savedEnabled !== null) {
    musicEnabled = savedEnabled === "true"
  }

  if (savedVolume !== null) {
    musicVolume = parseFloat(savedVolume)
  }

  // DO NOT PLAY UNTIL USER INTERACTS
  if (musicEnabled && audioUnlocked) {
    music.volume = musicVolume
    music.play().catch(() => {})
  }
}

// ------------------------------------------------------------
// MUSIC CONTROLS (NO MUSIC FADES)
// ------------------------------------------------------------
export function setMusicEnabled(enabled: boolean) {
  musicEnabled = enabled
  localStorage.setItem("ai_music_enabled", String(enabled))

  if (!music) return

  if (enabled) {
    if (audioUnlocked) {
      music.volume = musicVolume
      music.play().catch(() => {})
    }
  } else {
    music.pause()
    music.currentTime = 0
  }
}

export function setMusicVolume(vol: number) {
  musicVolume = vol
  localStorage.setItem("ai_music_volume", String(vol))

  if (!music) return
  if (!ducked) music.volume = vol
}

// ------------------------------------------------------------
// DUCKING (FADE DOWN + FADE UP)
// ------------------------------------------------------------
function duckMusic() {
  if (!music || ducked) return
  ducked = true

  const step = () => {
    if (!music) return

    if (music.volume > 0.05) {
      music.volume = Math.max(music.volume - 0.02, 0.05)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

function unduckMusic() {
  if (!music) return
  ducked = false

  const step = () => {
    if (!music) return

    if (music.volume < musicVolume) {
      music.volume = Math.min(music.volume + 0.02, musicVolume)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

// ------------------------------------------------------------
// VOICE QUEUE
// ------------------------------------------------------------
export function enqueueAudio(audio: HTMLAudioElement) {
  queue.push(audio)
  playNext()
}

function playNext() {
  if (isPlaying) return
  if (queue.length === 0) return

  // DO NOT PLAY UNTIL USER INTERACTS
  if (!audioUnlocked) {
    queue = [] // clear queue to avoid stacking
    return
  }

  isPlaying = true
  const audio = queue.shift()!

  audio.volume = 1.0

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
