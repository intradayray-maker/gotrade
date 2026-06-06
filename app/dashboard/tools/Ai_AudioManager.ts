// app/dashboard/tools/Ai_AudioManager.ts

// ------------------------------------------------------------
// GLOBAL AUDIO STATE
// ------------------------------------------------------------
let queue: Array<HTMLAudioElement> = []
let isPlaying = false

let music: HTMLAudioElement | null = null
let musicEnabled = true
let musicVolume = 0.35        // default
let targetMusicVolume = 0.35  // used for fades
let ducked = false

// ------------------------------------------------------------
// INIT MUSIC ENGINE
// ------------------------------------------------------------
export function initBackgroundMusic() {
  if (music) return

  music = new Audio("/voice/bgm/backgroundMUSIC.mp3")
  music.loop = true
  music.volume = 0

  const savedEnabled = localStorage.getItem("ai_music_enabled")
  const savedVolume = localStorage.getItem("ai_music_volume")

  if (savedEnabled !== null) {
    musicEnabled = savedEnabled === "true"
  }

  if (savedVolume !== null) {
    musicVolume = parseFloat(savedVolume)
    targetMusicVolume = musicVolume
  }

  if (musicEnabled) {
    music.play().catch(() => {})
    fadeMusicIn()
  }
}

// ------------------------------------------------------------
// MUSIC CONTROLS
// ------------------------------------------------------------
export function setMusicEnabled(enabled: boolean) {
  musicEnabled = enabled
  localStorage.setItem("ai_music_enabled", String(enabled))

  if (!music) return

  if (enabled) {
    music.play().catch(() => {})
    fadeMusicIn()
  } else {
    fadeMusicOut()
  }
}

export function setMusicVolume(vol: number) {
  musicVolume = vol
  targetMusicVolume = vol
  localStorage.setItem("ai_music_volume", String(vol))

  if (!music) return
  if (!ducked) music.volume = vol
}

// ------------------------------------------------------------
// MUSIC FADES
// ------------------------------------------------------------
function fadeMusicIn() {
  if (!music) return

  let step = () => {
    if (!musicEnabled) return
    if (!music) return

    if (music.volume < targetMusicVolume) {
      music.volume = Math.min(music.volume + 0.01, targetMusicVolume)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

function fadeMusicOut() {
  if (!music) return

  let step = () => {
    if (!music) return

    if (music.volume > 0) {
      music.volume = Math.max(music.volume - 0.01, 0)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

// ------------------------------------------------------------
// DUCKING (LOWER MUSIC DURING VOICE)
// ------------------------------------------------------------
function duckMusic() {
  if (!music || ducked) return
  ducked = true

  let step = () => {
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
  fadeMusicIn()
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
//test2