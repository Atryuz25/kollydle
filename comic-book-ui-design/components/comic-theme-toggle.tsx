"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ComicThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="relative flex items-center gap-2 border-[3px] border-foreground rounded-full px-3 py-1.5 font-display text-sm tracking-wide comic-shadow-sm bg-card text-card-foreground"
        aria-label="Toggle theme"
      >
        <span className="opacity-0">DAY SCENE</span>
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center gap-2 border-[3px] border-foreground rounded-full px-3 py-1.5 font-display text-sm tracking-wide comic-shadow-sm transition-all duration-250 hover:scale-105 active:scale-95 bg-card text-card-foreground dark-glow-teal"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4" aria-hidden="true" />
          <span>NIGHT SCENE</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" aria-hidden="true" />
          <span>DAY SCENE</span>
        </>
      )}
    </button>
  )
}
