// ------------------------------------------------------------
// AI TEXT INTELLIGENCE MODULE
// ------------------------------------------------------------

// EURUSD / NEWS-BASED LINES (unchanged)
export const AI_MESSAGES = [
  "The market rests today… yet even in silence, it remembers.",
  "No storms on the calendar, but the wise remain attentive.",
  "A quiet session… though the market rarely sleeps.",
  "Calm skies above, though old traders know calm is only borrowed time.",
  "No news today… but the market still watches from the shadows.",
  "The calendar is empty, but the tape always whispers.",
  "Stillness in the news… not always stillness in price.",
  "A quiet day… the kind that teaches patience more than action."
];

// ETH / VOLATILITY-BASED LINES
export const AI_MESSAGES_ETH = [
  "The flow rises… a quiet pressure building beneath the surface.",
  "Volatility breathes in slow waves… the market exhales in its own rhythm.",
  "The tape stirs… subtle motion, but motion nonetheless.",
  "Energy gathers at the edges… the kind that precedes direction.",
  "The pulse is steady… yet something beneath it shifts.",
  "Momentum drifts… not loud, but present.",
  "A soft swell forms… traders who listen can feel it.",
  "The current thickens… liquidity moves like a tide."
];

// RANDOM SELECTORS
export function getRandomMessage() {
  return AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
}

export function getRandomMessageETH() {
  return AI_MESSAGES_ETH[Math.floor(Math.random() * AI_MESSAGES_ETH.length)];
}
