"use client"

import { ComicThemeToggle } from "./comic-theme-toggle"

export function ComicHeader() {
  return (
    <header className="relative w-full pt-6 pb-2 px-4 overflow-hidden">
      {/* Halftone background overlay */}
      <div className="halftone absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Top bar with toggle */}
        <div className="w-full max-w-[560px] flex justify-end mb-6">
          <ComicThemeToggle />
        </div>

        {/* Decorative top bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-1 bg-comic-red rounded-full" />
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-comic-mustard" aria-hidden="true">
            <polygon
              points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
              fill="currentColor"
            />
          </svg>
          <div className="w-10 h-1 bg-comic-teal rounded-full" />
        </div>

        {/* Title with decorative border panel */}
        <div className="relative">
          {/* Angled accent stripe behind title */}
          <div className="absolute -inset-x-6 -inset-y-2 bg-comic-mustard/20 dark:bg-comic-mustard/10 rounded-xl -rotate-1 border-[3px] border-foreground/10 dark:border-foreground/5" />
          <h1
            className="relative font-display text-5xl sm:text-7xl lg:text-8xl tracking-wider text-foreground rotate-[-1deg] select-none comic-title-glow"
            style={{
              WebkitTextStroke: "2.5px currentColor",
              paintOrder: "stroke fill",
              textShadow: "4px 4px 0px var(--comic-mustard), 6px 6px 0px var(--comic-red)",
            }}
          >
            KOLLYDLE
          </h1>
        </div>

        {/* Colored accent bar under title */}
        <div className="flex items-center gap-0 mt-3 mb-4 w-64 max-w-full">
          <div className="flex-1 h-1.5 bg-comic-red rounded-l-full" />
          <div className="flex-1 h-1.5 bg-comic-mustard" />
          <div className="flex-1 h-1.5 bg-comic-teal rounded-r-full" />
        </div>

        {/* Speech bubble subtitle */}
        <div className="relative mb-4">
          <div className="speech-bubble relative border-[3px] border-foreground rounded-xl px-6 py-2.5 bg-[var(--comic-cream)] dark:bg-card dark-glow-teal">
            <p className="font-sans text-sm font-bold tracking-wide text-[var(--comic-ink)] dark:text-card-foreground uppercase">
              Guess the Tamil Movie of the Day!
            </p>
          </div>
        </div>

        {/* Inspiration credit */}
        <p className="text-xs font-sans text-foreground/60 dark:text-foreground/50 mt-2 text-center max-w-xs">
          Inspired by <a href="https://kodle.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/80 dark:hover:text-foreground/70 transition-colors">kodle.in</a>, reimagined for Tamil cinema
        </p>

        {/* Decorative bottom flourish */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-comic-red" />
          <div className="w-2 h-2 rounded-full bg-comic-mustard" />
          <div className="w-2 h-2 rounded-full bg-comic-teal" />
        </div>
      </div>
    </header>
  )
}
