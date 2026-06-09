// app\(public)\signup\page.tsx


'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signupAction } from './actions'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await signupAction(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push('/dashboard')
    })
  }

  return (
    <main
      className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4"
    >
      <div
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {/* LEFT: SIGNUP CARD */}
        <div
          className="
            bg-[#0A0A0F]
            border border-white/10
            rounded-xl
            p-8
            shadow-[0_0_40px_rgba(0,255,180,0.08)]
            space-y-6
          "
        >
          <h1
            className="text-3xl font-bold tracking-tight"
          >
            Create your GoTrade account
          </h1>

          <p
            className="text-white/60 text-sm leading-relaxed"
          >
            Start your journey with AI‑powered trading tools.
            No credit card required to create your account.
          </p>

          <form
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="
                w-full
                p-3
                rounded-lg
                bg-white/5
                border border-white/10
                text-white
                placeholder-white/40
                focus:outline-none
                focus:border-emerald-400
                transition
              "
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={8}
              className="
                w-full
                p-3
                rounded-lg
                bg-white/5
                border border-white/10
                text-white
                placeholder-white/40
                focus:outline-none
                focus:border-emerald-400
                transition
              "
            />

            {error && (
              <p
                className="text-red-500 text-sm"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="
                w-full
                py-3
                rounded-lg
                font-semibold
                bg-emerald-400
                text-black
                hover:bg-emerald-300
                transition
                shadow-[0_0_20px_rgba(0,255,180,0.35)]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p
            className="text-white/50 text-sm text-center pt-2"
          >
            Already have an account?{' '}
            <a
              href="/login"
              className="text-emerald-300 hover:text-emerald-200 transition"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* RIGHT: BENEFITS PANEL */}
        <div
          className="hidden md:flex flex-col justify-center space-y-5 p-6"
        >
          <h2
            className="text-2xl font-semibold"
          >
            What you get with GoTrade
          </h2>

          <ul
            className="space-y-3 text-white/70 text-sm"
          >
            <li
              className="flex items-start gap-3"
            >
              <span className="text-emerald-400 text-lg">•</span>
              Access to your dashboard and account settings
            </li>

            <li
              className="flex items-start gap-3"
            >
              <span className="text-emerald-400 text-lg">•</span>
              Ability to upgrade to Forex, Crypto, or Pro plans
            </li>

            <li
              className="flex items-start gap-3"
            >
              <span className="text-emerald-400 text-lg">•</span>
              Secure authentication powered by Supabase
            </li>

            <li
              className="flex items-start gap-3"
            >
              <span className="text-emerald-400 text-lg">•</span>
              Instant access to your member dashboard after signup
            </li>

            <li
              className="flex items-start gap-3"
            >
              <span className="text-emerald-400 text-lg">•</span>
              No credit card required to create your account
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
