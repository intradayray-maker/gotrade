"use client";

import React from "react";

interface GTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GTCard({ children, className, ...rest }: GTCardProps) {
  return (
    <div
      className={
        "relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)] " +
        (className || "")
      }
      {...rest}
    >
      <div className="rounded-xl bg-[#0b0b12] p-6">
        {children}
      </div>
    </div>
  );
}

