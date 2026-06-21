"use client";

import { ButtonHTMLAttributes } from "react";
import { goColors, goFont } from "@/lib/goTheme";
import clsx from "clsx";

type Variant = "green" | "red" | "ghost";

interface GTButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  glow?: boolean;
  lift?: boolean;
  ripple?: boolean;
  gradientBorder?: boolean;
}

export default function GTButton({
  variant = "green",
  glow = true,
  lift = true,
  ripple = true,
  gradientBorder = true,
  className,
  children,
  ...props
}: GTButtonProps) {
  const bg =
    variant === "green"
      ? goColors.green
      : variant === "red"
      ? goColors.red
      : "transparent";

  const textColor = variant === "ghost" ? goColors.lightGray : goColors.lightGray;

  const shadow =
    variant === "green"
      ? "0 0 34px rgba(3,82,65,0.7)"
      : variant === "red"
      ? "0 0 34px rgba(84,33,33,0.7)"
      : "0 0 18px rgba(0,0,0,0.6)";

  return (
    <div
      className={clsx(
        "inline-block p-[2px] rounded-md",
        gradientBorder && "animate-[spin_12s_linear_infinite]",
      )}
      style={{
        background: gradientBorder
          ? `linear-gradient(135deg, ${goColors.green}, ${goColors.gold}, ${goColors.red})`
          : "transparent",
        animationPlayState: gradientBorder ? "running" : "paused",
      }}
    >
      <button
        {...props}
        className={clsx(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none",
          ripple && "button-ripple",
          glow && "button-glow",
          lift && "button-lift",
          className,
        )}
        style={{
          background: bg,
          color: textColor,
          fontFamily: goFont,
          borderRadius: 6,
          padding: "15px 30px",
          boxShadow: shadow,
          border: variant === "ghost" ? `1px solid ${goColors.gray}` : "none",
        }}
      >
        {children}
      </button>
    </div>
  );
}
