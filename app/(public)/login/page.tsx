// app/(public)/login/page.tsx

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await loginAction(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push('/dashboard')
    })
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT: LOGIN CARD */}
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-8 shadow-[0_0_40px_rgba(0,255,180,0.08)] space-y-6">
          
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="text-white/60 text-sm leading-relaxed">
            Log in to access your dashboard, trading tools, and account settings.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="
                w-full p-3 rounded-lg bg-white/5 border border-white/10
                text-white placeholder-white/40 focus:outline-none
                focus:border-emerald-400 transition
              "
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
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
              {isPending ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 pt-2 text-sm">
            <a href="/forgot-password" className="text-emerald-300 hover:text-emerald-200 transition">
              Forgot your password?
            </a>

            <p className="text-white/50">
              Need an account?{' '}
              <a href="/signup" className="text-emerald-300 hover:text-emerald-200 transition">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: BENEFITS PANEL */}
        <div className="hidden md:flex flex-col justify-center space-y-5 p-6">
          <h2 className="text-2xl font-semibold">Why traders choose GoTrade</h2>

          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Access your personalized trading dashboard
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Manage your account, subscriptions, and settings
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Secure authentication powered by Supabase
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Fast access to your trading tools and insights
            </li>
          </ul>
        </div>

      </div>
    </main>
  )
}
