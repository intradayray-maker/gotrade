"use client";

import { useEffect, useRef, useState } from "react";

import GTSlider from "@/app/components/ui/GTSlider";
import GTCard from "@/components/ui/GTCard";

export default function AI_VoiceAssistantCard() {
  const [enabled, setEnabled] = useState(true);
  const [riskAmount, setRiskAmount] = useState(50);
  const [leverage, setLeverage] = useState(5);

  const [requiredMargin, setRequiredMargin] = useState(0);
  const [displayMargin, setDisplayMargin] = useState(0);
  const [flashColor, setFlashColor] = useState("");
  const prevMargin = useRef(0);

  const [status, setStatus] = useState("Listening for breakouts…");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleEnabled = () => {
    setEnabled(!enabled);
    setStatus(!enabled ? "Listening for breakouts…" : "Assistant disabled");
  };

  useEffect(() => {
    const oldVal = prevMargin.current;
    const newVal = requiredMargin;

    if (oldVal !== newVal) {
      setFlashColor(newVal > oldVal ? "flash-red" : "flash-green");
      setTimeout(() => setFlashColor(""), 300);

      const duration = 300;
      const start = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = progress * (2 - progress);
        setDisplayMargin(oldVal + (newVal - oldVal) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      prevMargin.current = newVal;
    }
  }, [requiredMargin]);

  return (
    <GTCard className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {now.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[20px] font-semibold tracking-wide text-slate-400">
            {now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all
          ${enabled ? "shadow-[0_0_8px_rgba(0,255,180,0.15)]" : ""}
        `}
      >
        <h3 className="text-xs tracking-wide text-slate-400">AI VOICE ASSISTANT</h3>

        <div
          onClick={toggleEnabled}
          className={`
            flex h-6 w-11 cursor-pointer items-center rounded-full transition-all
            ${enabled ? "bg-emerald-500 shadow-[0_0_6px_rgba(0,255,180,0.45)]" : "bg-slate-700"}
          `}
        >
          <div
            className={`
              h-5 w-5 rounded-full bg-white shadow transition-all
              ${enabled ? "translate-x-5" : "translate-x-1"}
            `}
          />
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/20 p-3">
        <p
          className={`
            text-sm tracking-wide transition-all
            ${enabled ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]" : "text-slate-500"}
          `}
        >
          {status}
        </p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Dollar Risk Per Trade"
          value={riskAmount}
          min={1}
          max={1000}
          step={1}
          onChange={setRiskAmount}
          dollars
        />
      </div>

      <div className="rounded-xl border border-emerald-500/20 p-4">
        <GTSlider
          title="Set your Leverage"
          value={leverage}
          min={1}
          max={50}
          step={1}
          onChange={setLeverage}
        />
      </div>

      <div
        className={`
          flex items-center justify-between rounded-xl border border-emerald-500/20 p-3 transition-all duration-300
          ${flashColor === "flash-green" ? "bg-emerald-950/30" : ""}
          ${flashColor === "flash-red" ? "bg-red-950/30" : ""}
        `}
      >
        <span className="text-slate-400">Required Margin:</span>
        <span className="text-xl font-semibold text-slate-50 tabular-nums">
          ${displayMargin.toFixed(2)}
        </span>
      </div>
    </GTCard>
  );
}
