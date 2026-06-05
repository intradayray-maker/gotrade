// app/(public)/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "./actions";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signupAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white">
      {/* ... your existing UI ... */}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded font-semibold"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* ... rest of your UI ... */}
    </main>
  );
}
