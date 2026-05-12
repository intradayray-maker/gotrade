import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  )
}