// app/admin/demo/TOOLS/Demo_AiVoice.ts

// ------------------------------------------------------------
// DEMO VOICE WRAPPER
// Uses real product voice clips (Ai_LocalVoice)
// Uses demo audio engine (Demo_AudioManager)
// Real product files remain 100% untouched.
// ------------------------------------------------------------

import { getVoiceClip, VoiceCategory } from "@/app/dashboard/products/TOOLS/Ai_LocalVoice"
import { enqueueDemoAudio, initDemoAudioUnlock } from "./Demo_AudioManager"

// Ensure audio unlock is initialized once
let unlockInitialized = false

function ensureUnlock() {
  if (!unlockInitialized) {
    initDemoAudioUnlock()
    unlockInitialized = true
  }
}

// ------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------
export function playVoice(type: VoiceCategory) {
  ensureUnlock()

  const audio = getVoiceClip(type)
  enqueueDemoAudio(audio)
}
