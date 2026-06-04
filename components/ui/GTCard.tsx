"use client";

import React from "react";

interface GTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GTCard({ children, className, ...rest }: GTCardProps) {
  return (
    <div
      className={`
        rounded-xl
        border-[2px]
        border-emerald-500/40
        bg-transparent
        p-6
        ${className || ""}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}
