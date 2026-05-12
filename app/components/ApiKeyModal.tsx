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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Connect {broker}</h2>

        <input
          className="w-full p-3 bg-neutral-800 border border-white/10 rounded"
          placeholder="API Key ID"
          value={keyId}
          onChange={(e) => setKeyId(e.target.value)}
        />

        <input
          className="w-full p-3 bg-neutral-800 border border-white/10 rounded"
          placeholder="Secret Key"
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />

        <select
          className="w-full p-3 bg-neutral-800 border border-white/10 rounded"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as "paper" | "live")}
        >
          <option value="paper">Paper Trading</option>
          <option value="live">Live Trading</option>
        </select>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={saveKeys}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
