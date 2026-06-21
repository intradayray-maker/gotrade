// app/(public)/reset-password/actions.ts

'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export async function resetPasswordAction(code: string | null, password: string) {
  if (!code) {
    return { error: 'Invalid or missing reset code.' }
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const supabase = await createSupabaseServerClient()

  // Exchange the code for a session
  const { error: verifyError } = await supabase.auth.exchangeCodeForSession(code)

  if (verifyError) {
    return { error: verifyError.message }
  }

  // Now update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password,
  })

  if (updateError) {
    return { error: updateError.message }
  }

  return { error: null }
}
