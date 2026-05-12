"use client";

import { useEffect, useState } from "react";

export default function AccountLinkingPage() {
  const [keyId, setKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [environment, setEnvironment] = useState("paper");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState<boolean | null>(null);

  // -----------------------------
  // STATUS FETCHER
  // -----------------------------
  async function refreshStatus() {
    try {
      const res = await fetch("/api/alpaca/status", { cache: "no-store" });
      const data = await res.json();
      setConnected(data.status === "connected");
    } catch {
      setConnected(false);
    }
  }

  // Load status on mount
  useEffect(() => {
    refreshStatus();
  }, []);

  // -----------------------------
  // ⭐ FIX: CLEAR STALE UI WHEN CONNECTION STATE CHANGES
  // -----------------------------
  useEffect(() => {
    setResult(null);
    setError("");

    if (connected === false) {
      setKeyId("");
      setSecretKey("");
    }
  }, [connected]);

  // -----------------------------
  // CONNECT HANDLER
  // -----------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/alpaca/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId, secretKey, environment }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await res.json()) as { error?: string; success?: boolean })
        : { error: await res.text() };

      if (!res.ok) {
        setError(data.error || "Failed to save keys");
      } else {
        setResult(data);
        await refreshStatus();
      }
    } catch (err) {
      console.error("Broker save failed:", err);
      setError(
        err instanceof Error ? err.message : "Unexpected error saving broker credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // DISCONNECT HANDLER
  // -----------------------------
  async function handleDisconnect() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/alpaca/disconnect", {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        setError("Failed to disconnect broker");
      } else {
        setResult({ success: true });
        await refreshStatus();
      }
    } catch {
      setError("Unexpected error disconnecting broker");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-xl mx-auto py-10 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Link Your Broker</h1>
        <p className="text-white/60 mt-1">
          Connect your Alpaca account to enable automated trading and portfolio syncing.
        </p>
      </div>

      {/* CONNECTED STATE */}
      {connected === true && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl space-y-6">
          <div className="p-4 rounded-xl border border-green-500/40 bg-green-900/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 text-lg">●</span>
              <h2 className="font-semibold text-green-300">Broker Connected</h2>
            </div>
            <p className="text-sm text-green-200/80">
              Your Alpaca account is currently linked.
            </p>
          </div>

          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/20"
          >
            {loading ? "Disconnecting..." : "Disconnect Broker"}
          </button>
        </div>
      )}

      {/* DISCONNECTED STATE */}
      {connected === false && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl space-y-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* API KEY */}
            <div className="space-y-1">
              <label className="block text-sm text-white/70">API Key ID</label>
              <input
                type="text"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                className="w-full rounded-lg bg-[#0d0d12] border border-white/10 px-3 py-2 text-white placeholder-white/30
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                placeholder="Your Alpaca API Key ID"
                required
              />
            </div>

            {/* SECRET KEY */}
            <div className="space-y-1">
              <label className="block text-sm text-white/70">Secret Key</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full rounded-lg bg-[#0d0d12] border border-white/10 px-3 py-2 text-white placeholder-white/30
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                placeholder="Your Alpaca Secret Key"
                required
              />
            </div>

            {/* ENVIRONMENT */}
            <div className="space-y-1">
              <label className="block text-sm text-white/70">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full rounded-lg bg-[#0d0d12] border border-white/10 px-3 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
              >
                <option value="paper">Paper Trading</option>
                <option value="live">Live Trading</option>
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? "Saving..." : "Save Keys"}
            </button>
          </form>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 font-medium text-sm">{error}</p>
          )}

          {/* SUCCESS */}
          {result?.success && (
            <div className="mt-4 p-4 rounded-xl border border-green-500/40 bg-green-900/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-lg">●</span>
                <h2 className="font-semibold text-green-300">Broker Linked</h2>
              </div>
              <p className="text-sm text-green-200/80">
                Your keys have been securely stored and are now ready for trading operations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* LOADING STATE */}
      {connected === null && (
        <p className="text-white/60">Checking broker status…</p>
      )}
    </div>
  );
}
