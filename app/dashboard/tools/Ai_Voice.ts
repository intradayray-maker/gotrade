// ------------------------------------------------------------
// AI VOICE INTELLIGENCE MODULE
// Centralized voice-safe lines for MP3 playback
// Tone: dark, wise, middle-aged professor, slow, non-upbeat
// ------------------------------------------------------------

// Short, generic, reusable voice lines
export const VOICE_SHORT = [
  "Short entry.",
  "Long entry.",
  "Trade active.",
  "Position open.",
  "Position closed.",
  "Stop loss hit.",
  "Target reached.",
  "Volatility rising.",
  "Volatility falling.",
  "Market shifting.",
  "Structure changing."
];

// Longer, atmospheric lines (still generic, no prices)
export const VOICE_ATMOS = [
  "A shift approaches… stay attentive.",
  "Momentum stirs beneath the surface.",
  "The market breathes… and prepares.",
  "A turning point draws near.",
  "The structure bends… but does not break.",
  "A calm before movement… watch closely.",
  "Pressure builds in the shadows of price."
];

// News-related lines (generic)
export const VOICE_NEWS = [
  "High impact news is coming up shortly.",
  "High impact news is right around the corner.",
  "A major event approaches… caution advised.",
  "News volatility may awaken soon.",
  "The market prepares for incoming news."
];

// ------------------------------------------------------------
// RANDOM SELECTORS
// ------------------------------------------------------------
export function pickShort() {
  return VOICE_SHORT[Math.floor(Math.random() * VOICE_SHORT.length)];
}

export function pickAtmos() {
  return VOICE_ATMOS[Math.floor(Math.random() * VOICE_ATMOS.length)];
}

export function pickNews() {
  return VOICE_NEWS[Math.floor(Math.random() * VOICE_NEWS.length)];
}

// ------------------------------------------------------------
// OPTIONAL: MAP LINES TO MP3 FILENAMES
// (You can expand this later as you upload audio files)
// ------------------------------------------------------------
export const VOICE_MP3_MAP: Record<string, string> = {
  "Short entry.": "/audio/short_entry.mp3",
  "Long entry.": "/audio/long_entry.mp3",
  "Trade active.": "/audio/trade_active.mp3",
  "Position open.": "/audio/position_open.mp3",
  "Position closed.": "/audio/position_closed.mp3",
  "Stop loss hit.": "/audio/stop_loss_hit.mp3",
  "Target reached.": "/audio/target_reached.mp3",
  "Volatility rising.": "/audio/vol_rising.mp3",
  "Volatility falling.": "/audio/vol_falling.mp3",
  "Market shifting.": "/audio/market_shifting.mp3",
  "Structure changing.": "/audio/structure_changing.mp3",

  // Atmos lines (example filenames)
  "A shift approaches… stay attentive.": "/audio/atmos_shift.mp3",
  "Momentum stirs beneath the surface.": "/audio/atmos_momentum.mp3",
  "The market breathes… and prepares.": "/audio/atmos_breathes.mp3",
  "A turning point draws near.": "/audio/atmos_turning.mp3",
  "The structure bends… but does not break.": "/audio/atmos_structure.mp3",
  "A calm before movement… watch closely.": "/audio/atmos_calm.mp3",
  "Pressure builds in the shadows of price.": "/audio/atmos_pressure.mp3",

  // News lines
  "High impact news is coming up shortly.": "/audio/news_soon.mp3",
  "High impact news is right around the corner.": "/audio/news_corner.mp3",
  "A major event approaches… caution advised.": "/audio/news_major.mp3",
  "News volatility may awaken soon.": "/audio/news_volatility.mp3",
  "The market prepares for incoming news.": "/audio/news_prepares.mp3"
};
