"use client";

import { useState } from "react";

export default function AlpacaLinkForm() {
  const [keyId, setKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [environment, setEnvironment] = useState<"paper" | "live">("paper");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/alpaca/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ keyId, secretKey, environment }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await res.json()) as { error?: string; success?: boolean })
        : { error: await res.text() };

      if (!res.ok || data.success === false) {
        setError(data.error || "Failed to link Alpaca account");
      } else {
        setMessage("Broker Linked — Your keys have been securely stored.");
      }
    } catch {
      setError("Unexpected error linking Alpaca account");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/alpaca/disconnect", {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res
        .json()
        .catch(() => ({ success: false, error: "Invalid response from server" }));

      if (!res.ok || data.success === false) {
        setError(data.error || "Failed to disconnect broker");
      } else {
        setMessage("Broker Disconnected — Your keys have been removed.");
      }
    } catch {
      setError("Unexpected error disconnecting broker");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off" // ⭐ prevents autofill-triggered submit
      className="space-y-4 bg-black/40 border border-white/10 rounded-lg p-4"
    >
      {/* ⭐ Dummy fields to defeat Chrome autofill */}
      <input type="text" name="fakeuser" autoComplete="username" className="hidden" />
      <input type="password" name="fakepass" autoComplete="new-password" className="hidden" />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Alpaca Account Linking</h2>
        <span className="text-xs text-white/50">
          Environment:
          <select
            className="ml-2 bg-black border border-white/20 rounded px-2 py-1 text-xs"
            value={environment}
            onChange={(e) =>
              setEnvironment(e.target.value as "paper" | "live")
            }
          >
            <option value="paper">Paper</option>
            <option value="live">Live</option>
          </select>
        </span>
      </div>

      <div className="space-y-2">
        <label className="block text-xs text-white/60">
          API Key ID
          <input
            type="text"
            autoComplete="off" // ⭐ prevents autofill
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            className="mt-1 w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white"
            placeholder="Your Alpaca API Key ID"
          />
        </label>

        <label className="block text-xs text-white/60">
          Secret Key
          <input
            type="password"
            autoComplete="new-password" // ⭐ prevents autofill
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="mt-1 w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white"
            placeholder="Your Alpaca Secret Key"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black rounded py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-50"
      >
        {loading ? "Linking..." : "Link Alpaca Account"}
      </button>

      <button
        type="button"
        onClick={handleDisconnect}
        disabled={loading}
        className="w-full bg-red-500/20 text-red-400 border border-red-500/40 rounded py-2 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50"
      >
        {loading ? "Disconnecting..." : "Disconnect Broker"}
      </button>

      {message && (
        <div className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/40 rounded px-3 py-2">
          {message}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/40 rounded px-3 py-2">
          {error}
        </div>
      )}
    </form>
  );
}
