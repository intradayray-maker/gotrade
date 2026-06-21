// components/TradeOutputCard.tsx
'use client'

import { useSupabaseUserId } from '@/hooks/useSupabaseUserId'
import { useEffect, useState } from 'react'

type Trade = {
 id: number
 ticker: string
 side: 'LONG' | 'SHORT'
 size: number
 entry: number
 stop: number
 tp: number
 required_margin: number
 risk_distance: number
 created_at: string
}

export function TradeOutputCard() {
 const { userId, loading } = useSupabaseUserId()
 const [trade, setTrade] = useState<Trade | null>(null)

 useEffect(() => {
  if (!userId || loading) return

  async function fetchLatestTrade() {
   try {
    // OPTION A — dynamic headers (TS-safe)
    const headers: HeadersInit = {}

    if (userId) {
     headers['x-user-id'] = userId
    }

    const res = await fetch('/api/trade', {
     method: 'GET',
     headers,
    })

    if (!res.ok) {
     console.error('Failed to fetch latest trade', await res.text())
     return
    }

    const data = await res.json()
    setTrade(data.trade ?? null)
   } catch (err) {
    console.error('Error calling /api/trade', err)
   }
  }

  fetchLatestTrade()
 }, [userId, loading])

 return (
  <div>
   {/* render trade fields if trade exists */}
  </div>
 )
}
