"use client";

import { InputHTMLAttributes } from "react";
import { goColors, goFont } from "@/lib/goTheme";
import clsx from "clsx";

interface GTInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function GTInput({ label, hint, className, ...props }: GTInputProps) {
  return (
    <div className="space-y-1" style={{ fontFamily: goFont }}>
      {label && (
        <p className="text-xs font-medium uppercase" style={{ color: goColors.lightGray }}>
          {label}
        </p>
      )}

      <input
        {...props}
        className={clsx(
          "w-full rounded-md bg-[#0b0b12] border px-3 py-2 text-sm outline-none",
          "focus:ring-2 focus:ring-offset-0",
          className,
        )}
        style={{
          borderColor: goColors.gray,
          color: goColors.lightGray,
          fontFamily: goFont,
        }}
      />

      {hint && (
        <p className="text-[11px]" style={{ color: goColors.gray }}>
          {hint}
        </p>
      )}
    </div>
  );
}
