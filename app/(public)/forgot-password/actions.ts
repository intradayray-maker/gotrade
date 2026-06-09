// app/(public)/forgot-password/actions.ts

'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email')

  if (typeof email !== 'string' || !email) {
    return { error: 'Invalid email' }
  }

  const supabase = await createSupabaseServerClient()

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000'

  const redirectTo = `${origin}/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
