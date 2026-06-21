type TickerId =
  | "EURUSD"
  | "GBPUSD"
  | "XAUUSD"
  | "BTCUSDT"
  | "ETHUSDT"
  | "AUDJPY"
  | "EURCAD"

export function getInitialTickerState(ticker: TickerId) {
  const price = getBasePrice(ticker)
  return {
    id: ticker,
    price
  }
}

function getBasePrice(ticker: TickerId) {
  switch (ticker) {
    case "EURUSD":
      return randInRange(1.05, 1.12)
    case "GBPUSD":
      return randInRange(1.2, 1.32)
    case "XAUUSD":
      return randInRange(1800, 2400)
    case "BTCUSDT":
      return randInRange(45000, 75000)
    case "ETHUSDT":
      return randInRange(2500, 4500)
    case "AUDJPY":
      return randInRange(92, 102)
    case "EURCAD":
      return randInRange(1.42, 1.52)
  }
}

function randInRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function randomizePrice(
  prev: ReturnType<typeof getInitialTickerState>
) {
  const base = getBasePrice(prev.id)
  const noise = base * (Math.random() - 0.5) * 0.002
  return {
    ...prev,
    price: base + noise
  }
}

export function spikePrice(
  prev: ReturnType<typeof getInitialTickerState>
) {
  return {
    ...prev,
    price: prev.price * 1.01
  }
}

export function dumpPrice(
  prev: ReturnType<typeof getInitialTickerState>
) {
  return {
    ...prev,
    price: prev.price * 0.99
  }
}

export function getInitialVolatilityState() {
  return {
    value: 65
  }
}

export function randomizeVolatility(
  prev: ReturnType<typeof getInitialVolatilityState>,
  mode: "high" | "medium" | "low" | "drift"
) {
  let target = prev.value
  if (mode === "high") target = Math.max(70, prev.value + 10)
  if (mode === "medium") target = Math.max(40, prev.value + 5)
  if (mode === "low") target = Math.min(35, prev.value - 5)
  if (mode === "drift") {
    target += (Math.random() - 0.5) * 4
  }
  return {
    value: Math.max(5, Math.min(100, target))
  }
}

export function getInitialNewsState() {
  return {
    impact: "none" as "none" | "high" | "medium" | "low",
    title: "No major events scheduled",
    subtitle: "",
    windowActive: false
  }
}

export function fakeNewsHigh() {
  return {
    impact: "high" as const,
    title: "High‑impact news event approaching",
    subtitle: "Expect sharp volatility spikes. Consider pausing new entries.",
    windowActive: true
  }
}

export function fakeNewsMedium() {
  return {
    impact: "medium" as const,
    title: "Medium‑impact news on the calendar",
    subtitle: "Volatility may increase. Trade with reduced size.",
    windowActive: false
  }
}

export function fakeNewsLow() {
  return {
    impact: "low" as const,
    title: "Low‑impact news only",
    subtitle: "Market conditions remain relatively stable.",
    windowActive: false
  }
}

export function getInitialTradeState() {
  return {
    ticker: "ETHUSDT",
    side: "",
    entry: 0,
    stop: 0,
    tp: 0,
    type: "" as "" | "entry_long" | "entry_short" | "sl" | "tp"
  }
}

export function fakeLongTrade(
  tickerState: ReturnType<typeof getInitialTickerState>
) {
  const entry = tickerState.price
  const stop = entry * (1 - randInRange(0.001, 0.003))
  const tp = entry * (1 + randInRange(0.002, 0.005))
  return {
    ticker: tickerState.id,
    side: "long",
    entry,
    stop,
    tp,
    type: "entry_long" as const
  }
}

export function fakeShortTrade(
  tickerState: ReturnType<typeof getInitialTickerState>
) {
  const entry = tickerState.price
  const stop = entry * (1 + randInRange(0.001, 0.003))
  const tp = entry * (1 - randInRange(0.002, 0.005))
  return {
    ticker: tickerState.id,
    side: "short",
    entry,
    stop,
    tp,
    type: "entry_short" as const
  }
}

export function fakeSlEvent(
  prev: ReturnType<typeof getInitialTradeState>
) {
  return {
    ...prev,
    type: "sl" as const
  }
}

export function fakeTpEvent(
  prev: ReturnType<typeof getInitialTradeState>
) {
  return {
    ...prev,
    type: "tp" as const
  }
}
