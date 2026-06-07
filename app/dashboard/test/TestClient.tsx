"use client";

import { useState, useEffect } from "react";

export default function TestClient() {
  const [state, setState] = useState("loading...");

  async function send(side: string) {
    await fetch("/dashboard/test/api", {
      method: "POST",
      body: JSON.stringify({ side }),
    });
    load();
  }

  async function load() {
    const res = await fetch("/dashboard/test/api");
    const json = await res.json();
    setState(json.side);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl">
        Current State:{" "}
        <span
          className={
            state === "long"
              ? "text-emerald-400"
              : state === "short"
              ? "text-red-400"
              : "text-slate-400"
          }
        >
          {state}
        </span>
      </div>

      <div className="flex gap-4">
        <button onClick={() => send("long")} className="px-4 py-2 bg-emerald-600 rounded">
          Long
        </button>

        <button onClick={() => send("short")} className="px-4 py-2 bg-red-600 rounded">
          Short
        </button>

        <button onClick={() => send("flat")} className="px-4 py-2 bg-slate-600 rounded">
          Flat
        </button>
      </div>
    </div>
  );
}
