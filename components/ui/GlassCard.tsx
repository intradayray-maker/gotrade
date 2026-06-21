"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-[#0b0b12] p-4",
        "transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
