"use client"

import { cn } from "@/lib/utils"

const LABEL_COLORS: Record<string, string> = {
  Genre: "bg-comic-teal text-[#FFFFFF]",
  Year: "bg-comic-mustard text-[#111111]",
  Director: "bg-comic-red text-[#FFFFFF]",
  "Lead Actor": "bg-comic-teal text-[#FFFFFF]",
  "Famous Dialogue": "bg-comic-mustard text-[#111111]",
}

const ACCENT_BORDERS: Record<string, string> = {
  Genre: "border-l-comic-teal",
  Year: "border-l-comic-mustard",
  Director: "border-l-comic-red",
  "Lead Actor": "border-l-comic-teal",
  "Famous Dialogue": "border-l-comic-mustard",
}

interface ComicHintCardProps {
  label: string
  value: string
  highlight?: string
  visible: boolean
  index: number
}

export function ComicHintCard({
  label,
  value,
  highlight,
  visible,
  index,
}: ComicHintCardProps) {
  if (!visible) return null

  const labelColor = LABEL_COLORS[label] || "bg-muted text-muted-foreground"
  const accentBorder = ACCENT_BORDERS[label] || "border-l-comic-mustard"

  return (
    <div
      className={cn(
        "relative border-[3px] border-foreground rounded-lg overflow-hidden animate-bounce-in comic-shadow-sm dark-glow-teal",
        `border-l-[6px] ${accentBorder}`
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Halftone in hint cards */}
      <div className="halftone absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-1.5 p-4">
        <span
          className={cn(
            "inline-flex self-start font-display text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm border-2 border-foreground/20",
            labelColor
          )}
        >
          {label}
        </span>
        <p className="font-sans text-sm font-semibold leading-relaxed text-card-foreground">
          {highlight ? (
            <>
              {value.split(new RegExp(`(${highlight})`, "gi")).map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                  <mark
                    key={i}
                    className="bg-comic-mustard text-[var(--comic-ink)] px-1 rounded-sm font-bold"
                    style={{ boxDecorationBreak: "clone" }}
                  >
                    {part}
                  </mark>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  )
}
