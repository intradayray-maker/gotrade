"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function UpdatePasswordPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Error updating password");
    } else {
      setMessage("Password updated successfully");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 space-y-6">
      <h1 className="text-2xl font-semibold">Update Password</h1>

      <input
        type="password"
        className="w-full p-3 rounded bg-white/10 border border-white/20"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-blue-600 rounded-lg"
      >
        Update Password
      </button>

      {message && <p className="text-white/70">{message}</p>}
    </div>
  );
}
