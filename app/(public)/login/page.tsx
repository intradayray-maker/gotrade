// app/(public)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
