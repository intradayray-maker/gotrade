"use client";

import { useEffect, useState } from "react";

export default function LocalTimeCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // -----------------------------
  //   LOCAL DATE (Thu, May 14)
  // -----------------------------
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  // -----------------------------
  //   LOCAL TIME (no seconds)
  // -----------------------------
  const rawTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const match = rawTime
    .replace(" ", "")
    .replace(/(AM|PM)/, (m) => m.toLowerCase())
    .match(/(\d+:\d+)(am|pm)/);

  const timeMain = match ? match[1] : "";
  const timeSuffix = match ? match[2] : "";

  // -----------------------------
  //   NYSE HOLIDAY CHECK
  // -----------------------------
  function isNYSEHoliday(date: Date) {
    const y = date.getFullYear();

    const nthWeekday = (n: number, weekday: number, month: number) => {
      const d = new Date(y, month, 1);
      while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
      d.setDate(d.getDate() + (n - 1) * 7);
      return d;
    };

    const lastWeekday = (weekday: number, month: number) => {
      const d = new Date(y, month + 1, 0);
      while (d.getDay() !== weekday) d.setDate(d.getDate() - 1);
      return d;
    };

    const newYears = new Date(y, 0, 1);
    const juneteenth = new Date(y, 5, 19);
    const independence = new Date(y, 6, 4);
    const christmas = new Date(y, 11, 25);

    const observed = (d: Date) => {
      const day = d.getDay();
      if (day === 0) return new Date(y, d.getMonth(), d.getDate() + 1);
      if (day === 6) return new Date(y, d.getMonth(), d.getDate() - 1);
      return d;
    };

    const holidays = [
      observed(newYears),
      nthWeekday(3, 1, 0), // MLK
      nthWeekday(3, 1, 1), // Presidents
      lastWeekday(1, 4), // Memorial Day
      observed(juneteenth),
      observed(independence),
      nthWeekday(1, 1, 8), // Labor Day
      nthWeekday(4, 4, 10), // Thanksgiving
      observed(christmas),
    ];

    // Good Friday
    const easter = getEaster(y);
    const goodFriday = new Date(easter);
    goodFriday.setDate(goodFriday.getDate() - 2);
    holidays.push(goodFriday);

    return holidays.some(
      (h) =>
        h.getFullYear() === date.getFullYear() &&
        h.getMonth() === date.getMonth() &&
        h.getDate() === date.getDate()
    );
  }

  function getEaster(year: number) {
    const f = Math.floor,
      G = year % 19,
      C = f(year / 100),
      H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
      I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
      J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
      L = I - J,
      month = 3 + f((L + 40) / 44),
      day = L + 28 - 31 * f(month / 4);
    return new Date(year, month - 1, day);
  }

  // -----------------------------
  //   NYSE MARKET STATUS
  // -----------------------------
  const nyNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const preMarketStart = new Date(nyNow);
  preMarketStart.setHours(4, 0, 0, 0);

  const marketOpen = new Date(nyNow);
  marketOpen.setHours(9, 30, 0, 0);

  const marketClose = new Date(nyNow);
  marketClose.setHours(16, 0, 0, 0);

  const afterHoursEnd = new Date(nyNow);
  afterHoursEnd.setHours(20, 0, 0, 0);

  let status = "CLOSED";
  let statusColor = "text-rose-400";

  const isWeekend = nyNow.getDay() === 0 || nyNow.getDay() === 6;
  const isHoliday = isNYSEHoliday(nyNow);

  // -----------------------------
  //   FIX: Weekend / Holiday override
  // -----------------------------
  if (!isWeekend && !isHoliday) {
    if (nyNow >= preMarketStart && nyNow < marketOpen) {
      status = "PRE‑MARKET";
      statusColor = "text-amber-300";
    } else if (nyNow >= marketOpen && nyNow < marketClose) {
      status = "MARKET OPEN";
      statusColor = "text-emerald-400";
    } else if (nyNow >= marketClose && nyNow < afterHoursEnd) {
      status = "AFTER‑HOURS";
      statusColor = "text-blue-300";
    }
  }

  // -----------------------------
  //   COUNTDOWN TO NEXT OPEN
  // -----------------------------
  let nextOpen = new Date(marketOpen);

  if (nyNow >= marketOpen) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  while (
    nextOpen.getDay() === 0 ||
    nextOpen.getDay() === 6 ||
    isNYSEHoliday(nextOpen)
  ) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  const diffMs = nextOpen.getTime() - nyNow.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor((diffMs / (1000 * 60)) % 60);
  const countdown = `${diffH}h ${diffM}m`;

  // -----------------------------
  //   RENDER
  // -----------------------------
  return (
    <div className="flex flex-col gap-4 w-full">

      {/* DATE */}
      <div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
        <div className="text-[15px] bold text-slate-400 tracking-wide">
          {dateStr}
        </div>
      </div>

      {/* TIME */}
      <div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-4 flex flex-col items-center justify-center">
        <div className="flex items-end gap-1 text-slate-50 font-semibold tracking-tight">
          <span className="text-[40px] text-slate-300 leading-none">
            {timeMain}
          </span>
          <span className="text-lg opacity-70 leading-none pb-[2px]">
            {timeSuffix}
          </span>
        </div>
      </div>

      {/* STATUS */}
      <div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
        <div className={`text-sm font-medium ${statusColor}`}>{status}</div>

        {status !== "MARKET OPEN" && (
          <div className="text-[11px] text-slate-400 mt-1">
            Opens in {countdown}
          </div>
        )}
      </div>
    </div>
  );
}
