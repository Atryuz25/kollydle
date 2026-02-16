"use client"

import { cn } from "@/lib/utils"

interface ComicAttemptsProps {
  total: number
  used: number
  results: ("correct" | "wrong" | "unused")[]
}

export function ComicAttempts({ total, used, results }: ComicAttemptsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">
        ATTEMPTS
      </span>
      <div
        className="flex items-center justify-center gap-2.5"
        role="group"
        aria-label={`${used} of ${total} attempts used`}
      >
        {results.map((result, i) => (
          <div
            key={i}
            className={cn(
              "relative w-9 h-9 border-[3px] border-foreground rounded-md transition-all duration-300 flex items-center justify-center",
              result === "correct" && "bg-comic-teal animate-ink-splash comic-shadow-sm",
              result === "wrong" && "bg-comic-red animate-ink-splash comic-shadow-sm",
              result === "unused" && "bg-card"
            )}
            aria-label={
              result === "correct"
                ? `Attempt ${i + 1}: correct`
                : result === "wrong"
                  ? `Attempt ${i + 1}: wrong`
                  : `Attempt ${i + 1}: unused`
            }
          >
            {result === "correct" && (
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FFFFFF]" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            )}
            {result === "wrong" && (
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FFFFFF]" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            )}
            {result === "unused" && (
              <span className="font-display text-xs text-muted-foreground">{i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
