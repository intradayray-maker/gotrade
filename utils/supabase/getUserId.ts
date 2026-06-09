// utils/supabase/getUserId.ts
import { createClient()} from './client'

export async function getSupabaseUserId() {
 const {
  data: { user },
  error,
 } = await supabaseBrowserClient.auth.getUser()

 if (error) {
  console.error('Error fetching Supabase user:', error.message)
  return null
 }

 if (!user) {
  console.warn('No Supabase user found (not logged in).')
  return null
 }

 return user.id // UUID from auth.users
}
