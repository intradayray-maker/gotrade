// app/dashboard/tools/Ai_LocalVoice.ts

// ------------------------------------------------------------
// FLAT
// ------------------------------------------------------------
const flatClips = [
  "/voice/flat/flat_01.mp3",
  "/voice/flat/flat_02.mp3",
  "/voice/flat/flat_03.mp3",
  "/voice/flat/flat_04.mp3",
  "/voice/flat/flat_05.mp3",
  "/voice/flat/flat_06.mp3",
  "/voice/flat/flat_07.mp3",
  "/voice/flat/flat_08.mp3",
  "/voice/flat/flat_09.mp3",
  "/voice/flat/flat_10.mp3",
  "/voice/flat/flat_11.mp3",
  "/voice/flat/flat_12.mp3",
  "/voice/flat/flat_13.mp3",
  "/voice/flat/flat_14.mp3",
  "/voice/flat/flat_15.mp3",
  "/voice/flat/flat_16.mp3",
  "/voice/flat/flat_17.mp3",
  "/voice/flat/flat_18.mp3",
  "/voice/flat/flat_19.mp3",
  "/voice/flat/flat_20.mp3",
]

// ------------------------------------------------------------
// LONG
// ------------------------------------------------------------
const longClips = [
  "/voice/long/long_01.mp3",
  "/voice/long/long_02.mp3",
  "/voice/long/long_03.mp3",
  "/voice/long/long_04.mp3",
  "/voice/long/long_05.mp3",
  "/voice/long/long_06.mp3",
  "/voice/long/long_07.mp3",
  "/voice/long/long_08.mp3",
  "/voice/long/long_09.mp3",
  "/voice/long/long_10.mp3",
  "/voice/long/long_11.mp3",
  "/voice/long/long_12.mp3",
  "/voice/long/long_13.mp3",
  "/voice/long/long_14.mp3",
  "/voice/long/long_15.mp3",
  "/voice/long/long_16.mp3",
  "/voice/long/long_17.mp3",
  "/voice/long/long_18.mp3",
  "/voice/long/long_19.mp3",
  "/voice/long/long_20.mp3",
]

// ------------------------------------------------------------
// SHORT
// ------------------------------------------------------------
const shortClips = [
  "/voice/short/short_01.mp3",
  "/voice/short/short_02.mp3",
  "/voice/short/short_03.mp3",
  "/voice/short/short_04.mp3",
  "/voice/short/short_05.mp3",
  "/voice/short/short_06.mp3",
  "/voice/short/short_07.mp3",
  "/voice/short/short_08.mp3",
  "/voice/short/short_09.mp3",
  "/voice/short/short_10.mp3",
  "/voice/short/short_11.mp3",
  "/voice/short/short_12.mp3",
  "/voice/short/short_13.mp3",
  "/voice/short/short_14.mp3",
  "/voice/short/short_15.mp3",
  "/voice/short/short_16.mp3",
  "/voice/short/short_17.mp3",
  "/voice/short/short_18.mp3",
  "/voice/short/short_19.mp3",
  "/voice/short/short_20.mp3",
]

// ------------------------------------------------------------
// RISK
// ------------------------------------------------------------
const riskClips = [
  "/voice/risk/risk_01.mp3",
  "/voice/risk/risk_02.mp3",
  "/voice/risk/risk_03.mp3",
  "/voice/risk/risk_04.mp3",
  "/voice/risk/risk_05.mp3",
  "/voice/risk/risk_06.mp3",
  "/voice/risk/risk_07.mp3",
  "/voice/risk/risk_08.mp3",
  "/voice/risk/risk_09.mp3",
  "/voice/risk/risk_10.mp3",
  "/voice/risk/risk_11.mp3",
  "/voice/risk/risk_12.mp3",
  "/voice/risk/risk_13.mp3",
  "/voice/risk/risk_14.mp3",
  "/voice/risk/risk_15.mp3",
  "/voice/risk/risk_16.mp3",
  "/voice/risk/risk_17.mp3",
  "/voice/risk/risk_18.mp3",
  "/voice/risk/risk_19.mp3",
  "/voice/risk/risk_20.mp3",
]

// ------------------------------------------------------------
// PERSONA
// ------------------------------------------------------------
const personaClips = [
  "/voice/persona/persona_01.mp3",
  "/voice/persona/persona_02.mp3",
  "/voice/persona/persona_03.mp3",
  "/voice/persona/persona_04.mp3",
  "/voice/persona/persona_05.mp3",
  "/voice/persona/persona_06.mp3",
  "/voice/persona/persona_07.mp3",
  "/voice/persona/persona_08.mp3",
  "/voice/persona/persona_09.mp3",
  "/voice/persona/persona_10.mp3",
  "/voice/persona/persona_11.mp3",
  "/voice/persona/persona_12.mp3",
  "/voice/persona/persona_13.mp3",
  "/voice/persona/persona_14.mp3",
  "/voice/persona/persona_15.mp3",
  "/voice/persona/persona_16.mp3",
  "/voice/persona/persona_17.mp3",
  "/voice/persona/persona_18.mp3",
  "/voice/persona/persona_19.mp3",
  "/voice/persona/persona_20.mp3",
]

// ------------------------------------------------------------
// RANDOM SELECTOR
// ------------------------------------------------------------
function pick(list: string[]) {
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}

// ------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------
export function getVoiceClip(type: "flat" | "long" | "short" | "risk" | "persona") {
  const list =
    type === "flat" ? flatClips :
    type === "long" ? longClips :
    type === "short" ? shortClips :
    type === "risk" ? riskClips :
    personaClips

  const file = pick(list)
  return new Audio(file)
}
