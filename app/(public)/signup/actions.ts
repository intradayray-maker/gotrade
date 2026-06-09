// app\(public)\signup\actions.ts

'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export async function signupAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Invalid form submission' }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // success → return empty object
  return { error: null }
}

