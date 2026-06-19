import { useEffect, useState } from "react"

export function useLiveTrade() {
  const [trade, setTrade] = useState(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/trade")
      const data = await res.json()
      if (data) setTrade(data)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return trade
}
