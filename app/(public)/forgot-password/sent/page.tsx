// app/(public)/forgot-password/sent/page.tsx

export default function ForgotPasswordSentPage() {
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
          text-center
        "
      >
        <h1
          className="text-3xl font-bold tracking-tight"
        >
          Check your email
        </h1>

        <p
          className="text-white/60 text-sm leading-relaxed"
        >
          If an account exists for that email, we&apos;ve sent a secure link to reset your password.
        </p>

        <div
          className="pt-4"
        >
          <a
            href="/login"
            className="
              inline-block
              px-6
              py-3
              rounded-lg
              font-semibold
              bg-emerald-400
              text-black
              hover:bg-emerald-300
              transition
              shadow-[0_0_20px_rgba(0,255,180,0.35)]
            "
          >
            Return to Login
          </a>
        </div>

        <p
          className="text-white/40 text-xs"
        >
          Didn&apos;t receive the email? Check your spam folder.
        </p>
      </div>
    </main>
  )
}
