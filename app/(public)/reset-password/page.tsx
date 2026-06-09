// app\(public)\reset-password\page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    setLoading(false)

    if (error) {
      setSuccess(false)
      setStatus(error.message)
      return
    }

    setSuccess(true)
    setStatus('Password updated successfully. Redirecting…')

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <main
      className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4"
    >
      <div
        className="
          w-full
          max-w-md
          bg-[#0A0A0F]
          border border-white/10
          rounded-xl
          p-8
          shadow-[0_0_40px_rgba(0,255,180,0.08)]
          space-y-6
        "
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Set a new password
        </h1>

        <p className="text-white/60 text-sm leading-relaxed">
          Enter a new password for your account.
        </p>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full p-3 rounded-lg bg-white/5 border border-white/10
              text-white placeholder-white/40 focus:outline-none
              focus:border-emerald-400 transition
            "
          />

          {status && !success && (
            <p className="text-red-500 text-sm">
              {status}
            </p>
          )}

          {success && (
            <div
              className="
                flex items-center gap-2
                text-emerald-400
                text-sm
                font-medium
              "
            >
              <span className="text-lg">
                ✓
              </span>

              <span>
                {status}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-lg font-semibold bg-emerald-400 text-black
              hover:bg-emerald-300 transition shadow-[0_0_20px_rgba(0,255,180,0.35)]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
}
