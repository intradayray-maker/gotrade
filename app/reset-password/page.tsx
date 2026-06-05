// app/reset-password/page.tsx

'use client';

import { useState } from 'react';
import { supabaseBrowserClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const supabase = supabaseBrowserClient;

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleReset() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (!error) setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-slate-800 bg-[#0b0b12] p-6">
        <h1 className="text-xl font-semibold">Reset Password</h1>

        {sent ? (
          <p className="text-sm text-slate-400">
            A reset link has been sent to your email.
          </p>
        ) : (
          <>
            <input
              className="w-full rounded bg-slate-900 p-2 text-sm"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="w-full rounded bg-blue-600 py-2 text-sm font-medium"
            >
              Send reset link
            </button>
          </>
        )}
      </div>
    </div>
  );
}
