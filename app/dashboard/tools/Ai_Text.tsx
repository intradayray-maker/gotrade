// ------------------------------------------------------------
// AI TEXT INTELLIGENCE MODULE
// Centralized persona lines for UI + Voice
// Tone: dark, wise, middle-aged professor, slow, non-upbeat
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// RANDOM SELECTOR
// ------------------------------------------------------------
export function getRandomMessage() {
  return AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
}
