// components/AI_VoiceAssistantCard.tsx
'use client'

import { useSupabaseUserId } from '@/hooks/useSupabaseUserId'
import { useEffect, useState } from 'react'

export function AI_VoiceAssistantCard() {
 const { userId, loading } = useSupabaseUserId()

 const [dollarRisk, setDollarRisk] = useState(50)
 const [leverage, setLeverage] = useState(10)
 const [requiredMargin, setRequiredMargin] = useState(0)
 const [size, setSize] = useState(0)
 const [riskDistance, setRiskDistance] = useState(0)

 useEffect(() => {
  if (!userId || loading) return

  async function fetchMargin() {
   try {
    // OPTION A — dynamic headers (TS-safe)
    const headers: HeadersInit = {
     'Content-Type': 'application/json',
    }

    if (userId) {
     headers['x-user-id'] = userId
    }

    const res = await fetch('/api/margin', {
     method: 'POST',
     headers,
     body: JSON.stringify({
      dollar_risk: dollarRisk,
      leverage,
     }),
    })

    if (!res.ok) {
     console.error('Margin request failed', await res.text())
     return
    }

    const data = await res.json()

    setRequiredMargin(data.required_margin ?? 0)
    setSize(data.size ?? 0)
    setRiskDistance(data.risk_distance ?? 0)
   } catch (err) {
    console.error('Error calling /api/margin', err)
   }
  }

  fetchMargin()
 }, [userId, loading, dollarRisk, leverage])

 return (
  <div>
   {/* sliders + labels */}
   {/* show requiredMargin, size, riskDistance */}
  </div>
 )
}
