// app\(public)\signup\page.tsx


'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signupAction } from './actions'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Strong password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

  // Strength meter scoring
  function scorePassword(pw: string) {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[!@#$%^&*]/.test(pw)) score++
    return score // 0–6
  }

  const strength = scorePassword(password)

  function strengthColor() {
    if (!password) return 'bg-white/10'
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 4) return 'bg-yellow-400'
    return 'bg-emerald-400'
  }

  function strengthLabel() {
    if (!password) return ''
    if (strength <= 2) return 'Weak'
    if (strength <= 4) return 'Medium'
    return 'Strong'
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!strongPasswordRegex.test(password)) {
      setError(
        'Password must be 8+ chars and include upper/lowercase, number, and symbol.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

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
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT: SIGNUP CARD */}
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-8 shadow-[0_0_40px_rgba(0,255,180,0.08)] space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Join GoTrade 
          </h1>

          <p className="text-white/60 text-sm leading-relaxed">
            Start your journey with AI‑powered trading tools.
            No credit card required to create your account.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full p-3 rounded-lg bg-white/5 border border-white/10
                    text-white placeholder-white/40 focus:outline-none
                    focus:border-emerald-400 transition
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Strength Meter */}
              <div className="flex items-center gap-3">
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${strengthColor()} transition-all`}
                    style={{ width: `${(strength / 6) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white/60">
                  {strengthLabel()}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                  w-full p-3 rounded-lg bg-white/5 border border-white/10
                  text-white placeholder-white/40 focus:outline-none
                  focus:border-emerald-400 transition
                "
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-white/50 hover:text-white"
              >
                {showConfirm ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isPending}
              className="
                w-full py-3 rounded-lg font-semibold bg-emerald-400 text-black
                hover:bg-emerald-300 transition shadow-[0_0_20px_rgba(0,255,180,0.35)]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-white/50 text-sm text-center pt-2">
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
        <div className="hidden md:flex flex-col justify-center space-y-5 p-6">
          <h2 className="text-2xl font-semibold">
            What you get with GoTrade
          </h2>

          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Access to your dashboard and account settings
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Ability to upgrade to Forex, Crypto, or Pro plans
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Secure authentication powered by Supabase
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              Instant access to your member dashboard after signup
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">•</span>
              No credit card required to create your account
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
