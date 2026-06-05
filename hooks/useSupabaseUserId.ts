// hooks/useSupabaseUserId.ts
import { useEffect, useState } from 'react'
import { getSupabaseUserId } from '@/utils/supabase/getUserId'

export function useSupabaseUserId() {
 const [userId, setUserId] = useState<string | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  let isMounted = true

  async function loadUser() {
   setLoading(true)
   const id = await getSupabaseUserId()
   if (isMounted) {
    setUserId(id)
    setLoading(false)
   }
  }

  loadUser()

  return () => {
   isMounted = false
  }
 }, [])

 return { userId, loading }
}
