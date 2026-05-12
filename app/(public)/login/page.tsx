"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    toast.success("Logged in successfully");
    router.push("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded font-semibold"
        >
          Log In
        </button>
      </form>

      <div className="text-center mt-4">
        <a
          href="/reset-password"
          className="text-white/70 hover:text-white transition"
        >
          Forgot your password?
        </a>
      </div>

      <div className="text-center mt-4 text-white/60">
        Don’t have an account?{" "}
        <a href="/signup" className="text-white hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
