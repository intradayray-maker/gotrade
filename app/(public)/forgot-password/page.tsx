// app/(public)/forgot-password/page.tsx

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient() } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email')

    startTransition(async () => {
      if (typeof email !== 'string' || !email) {
        setError('Invalid email')
        return
      }

      try {
        const supabase = createClient()()

        const origin =
          (typeof window !== 'undefined' && window.location.origin) ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          'http://localhost:3000'

        const redirectTo = `${origin}/reset-password`

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        })

        if (error) {
          setError(error.message)
          return
        }

        router.push('/forgot-password/sent')
      } catch (err) {
        console.error(err)
        setError('Failed to send reset link')
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-xl p-8 shadow-[0_0_40px_rgba(0,255,180,0.08)] space-y-6">

        <h1 className="text-3xl font-bold tracking-tight">
          Reset your password
        </h1>

        <p className="text-white/60 text-sm leading-relaxed">
          Enter your account email and we&apos;ll send you a secure link to reset your password.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">

          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="
              w-full p-3 rounded-lg bg-white/5 border border-white/10
              text-white placeholder-white/40 focus:outline-none
              focus:border-emerald-400 transition
            "
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full py-3 rounded-lg font-semibold bg-emerald-400 text-black
              hover:bg-emerald-300 transition shadow-[0_0_20px_rgba(0,255,180,0.35)]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isPending ? 'Sending reset link…' : 'Send reset link'}
          </button>
        </form>

        <p className="text-white/50 text-sm text-center">
          Remember your password?{' '}
          <a href="/login" className="text-emerald-300 hover:text-emerald-200 transition">
            Log in
          </a>
        </p>
      </div>
    </main>
  )
}
