"use client";

import { useState } from "react";

export default function ApiKeyModal({
  broker,
  onClose,
}: {
  broker: string;
  onClose: () => void;
}) {
  const [keyId, setKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [environment, setEnvironment] = useState<"paper" | "live">("paper");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function saveKeys() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/alpaca/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyId,
          secretKey,
          environment,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const result = contentType.includes("application/json")
        ? ((await response.json()) as { error?: string })
        : { error: await response.text() };

      if (!response.ok) {
        setError(result.error ?? "Failed to save Alpaca credentials");
        return;
      }

      onClose();
    } catch {
      setError("Unexpected error saving Alpaca credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold">Connect {broker}</h2>

        <input
          className="w-full rounded border border-white/10 bg-neutral-800 p-3"
          placeholder="API Key ID"
          value={keyId}
          onChange={(event) => setKeyId(event.target.value)}
        />

        <input
          className="w-full rounded border border-white/10 bg-neutral-800 p-3"
          placeholder="Secret Key"
          type="password"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />

        <select
          className="w-full rounded border border-white/10 bg-neutral-800 p-3"
          value={environment}
          onChange={(event) => setEnvironment(event.target.value as "paper" | "live")}
        >
          <option value="paper">Paper Trading</option>
          <option value="live">Live Trading</option>
        </select>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded bg-neutral-700 py-2 hover:bg-neutral-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveKeys}
            disabled={loading}
            className="flex-1 rounded bg-blue-600 py-2 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
