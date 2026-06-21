"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type BarState = {
  active: "ETH" | "EUR"
  ethEntry: number
  ethStop: number
  eurEntry: number
  eurStop: number
}

type NewsImpact = "low" | "medium" | "high"
type NewsTiming = "now" | "3h" | "tmr"

type NewsState = {
  today: NewsTiming
  impact: NewsImpact
  nextEvent: string
  countdown: number
  windowActive: boolean
}

type TradeState = {
  type: string
  side: string
}

type DemoState = {
  bar: BarState
  setActiveBar: (t: "ETH" | "EUR") => void
  updateBarEntry: (v: number) => void

  news: NewsState
  setNewsToday: (v: NewsTiming) => void
  setImpact: (v: NewsImpact) => void
  setNextEvent: (v: string) => void
  setNewsCountdown: (v: number) => void
  setNewsWindow: (v: boolean) => void

  trade: TradeState
  setTradeType: (t: string) => void
  setTradeSide: (s: string) => void
  resetTrade: () => void

  tradeVersion: number
}

// ------------------------------------------------------------
// CONTEXT
// ------------------------------------------------------------
const DemoContext = createContext<DemoState | null>(null)

// ------------------------------------------------------------
// PROVIDER
// ------------------------------------------------------------
export function DemoProvider({ children }: { children: ReactNode }) {

  // ----------------------------------------------------------
  // BAR SLIDER STATE
  // ----------------------------------------------------------
  const [bar, setBar] = useState<BarState>({
    active: "EUR",
    ethEntry: 1643.38,
    ethStop: 1635.01,
    eurEntry: 1.15586,
    eurStop: 1.15554,
  })

  const setActiveBar = useCallback((t: "ETH" | "EUR") => {
    setBar(prev => ({ ...prev, active: t }))
  }, [])

  const updateBarEntry = useCallback((v: number) => {
    setBar(prev => {
      if (prev.active === "ETH") {
        const stop = v - v * rand(0.001, 0.003)
        return { ...prev, ethEntry: v, ethStop: stop }
      }
      if (prev.active === "EUR") {
        const stop = v - rand(0.0002, 0.0004)
        return { ...prev, eurEntry: v, eurStop: stop }
      }
      return prev
    })
  }, [])

  // ----------------------------------------------------------
  // NEWS STATE (FULLY FIXED)
  // ----------------------------------------------------------
  const [news, setNews] = useState<NewsState>({
    today: "now",
    impact: "low",
    nextEvent: "Happening Now",
    countdown: 120,
    windowActive: true,
  })

  const setImpact = (v: NewsImpact) =>
    setNews(prev => ({ ...prev, impact: v }))

  const setNextEvent = (v: string) =>
    setNews(prev => ({ ...prev, nextEvent: v }))

  const setNewsCountdown = (v: number) =>
    setNews(prev => ({ ...prev, countdown: v }))

  const setNewsWindow = (v: boolean) =>
    setNews(prev => ({ ...prev, windowActive: v }))

  // ----------------------------------------------------------
  // FIXED LOGIC FOR ALL NEWS SCENARIOS
  // ----------------------------------------------------------
  const setNewsToday = (v: NewsTiming) => {
    setNews(prev => {
      // Get current ET time
      const now = new Date()
      const etNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      )

      // Format helper
      const fmt = (d: Date) =>
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })

      // -------------------------
      // NEWS HAPPENING NOW
      // -------------------------
      if (v === "now") {
        return {
          ...prev,
          today: "now",
          nextEvent: "Happening Now",
          countdown: 120,      // 2 hours
          windowActive: true,  // unsafe
        }
      }

      // -------------------------
      // NEWS IN 3 HOURS
      // -------------------------
      if (v === "3h") {
        const future = new Date(etNow.getTime() + 3 * 60 * 60 * 1000)

        return {
          ...prev,
          today: "3h",
          nextEvent: fmt(future),  // actual ET time + 3 hours
          countdown: 180,
          windowActive: false,
        }
      }

      // -------------------------
      // NEWS TOMORROW
      // -------------------------
      if (v === "tmr") {
        return {
          ...prev,
          today: "tmr",
          nextEvent: "Tomorrow 8:30 AM",
          countdown: 9999,     // future event → clean output
          windowActive: false,
        }
      }

      return prev
    })
  }

  // ----------------------------------------------------------
  // TRADE STATE
  // ----------------------------------------------------------
  const [trade, setTrade] = useState<TradeState>({
    type: "",
    side: "",
  })

  const [tradeVersion, setTradeVersion] = useState(0)
  const bumpTradeVersion = () => setTradeVersion(v => v + 1)

  const setTradeType = (t: string) => {
    setTrade(prev => ({ ...prev, type: t }))
    bumpTradeVersion()
  }

  const setTradeSide = (s: string) => {
    setTrade(prev => ({ ...prev, side: s }))
    bumpTradeVersion()
  }

  const resetTrade = () => {
    setTrade({
      type: "",
      side: "",
    })

    setBar(prev => ({
      ...prev,
      ethEntry: 0,
      ethStop: 0,
      eurEntry: 0,
      eurStop: 0,
    }))

    bumpTradeVersion()
  }

  // ----------------------------------------------------------
  // PROVIDER VALUE
  // ----------------------------------------------------------
  const value: DemoState = {
    bar,
    setActiveBar,
    updateBarEntry,

    news,
    setNewsToday,
    setImpact,
    setNextEvent,
    setNewsCountdown,
    setNewsWindow,

    trade,
    setTradeType,
    setTradeSide,
    resetTrade,

    tradeVersion,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

// ------------------------------------------------------------
// HOOK
// ------------------------------------------------------------
export function useDemoState() {
  const ctx = useContext(DemoContext)
  if (!ctx) {
    throw new Error("useDemoState must be used within DemoProvider")
  }
  return ctx
}
