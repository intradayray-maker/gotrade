"use client";

import { useState } from "react";

export default function Toggle({ defaultOn = false, onChange }: any) {
  const [on, setOn] = useState(defaultOn);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={toggle}
      className={`h-6 w-12 rounded-full relative transition ${
        on ? "bg-green-500" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          on ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}
