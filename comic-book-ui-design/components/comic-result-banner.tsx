"use client"

import { cn } from "@/lib/utils"
import { generateShareText, copyShareTextToClipboard } from "@/src/utils/shareResult"
import { useToast } from "@/hooks/use-toast"

interface ComicResultBannerProps {
  type: "success" | "failure"
  movieTitle: string
  guesses?: string[]
  gameStatus?: string
  dailyMovieTitle?: string
  timeUntilNext?: string
}

export function ComicResultBanner({ type, movieTitle, guesses = [], gameStatus = "", dailyMovieTitle, timeUntilNext }: ComicResultBannerProps) {
  const isSuccess = type === "success"
  const { toast } = useToast()

  async function handleShare() {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    const text = generateShareText({ dateStr: today, guesses, gameStatus, dailyTitle: dailyMovieTitle || movieTitle })
    const ok = await copyShareTextToClipboard(text)
    if (ok) {
      toast({ title: "Copied!", description: "Result copied to clipboard." })
    } else {
      toast({ title: "Copy failed", description: "Unable to copy to clipboard.", variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 animate-banner-drop">
      {/* Starburst / Impact panel */}
      <div className="relative">
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 200 200"
              className="w-[300px] h-[300px] animate-starburst"
              aria-hidden="true"
            >
              <polygon
                points="100,10 115,75 180,30 125,85 190,100 125,115 180,170 115,125 100,190 85,125 20,170 75,115 10,100 75,85 20,30 85,75"
                fill="var(--comic-mustard)"
                stroke="var(--comic-ink)"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}

        <div
          className={cn(
            "relative z-10 border-[4px] border-foreground rounded-xl px-8 py-5 comic-shadow",
            isSuccess ? "bg-comic-mustard" : "bg-comic-red"
          )}
        >
          <h2
            className={cn(
              "font-display text-4xl sm:text-5xl tracking-wider text-center",
              isSuccess ? "text-[#111111]" : "text-[#FFFFFF]"
            )}
            style={{
              textShadow: isSuccess
                ? "2px 2px 0px var(--comic-red)"
                : "2px 2px 0px rgba(0,0,0,0.4)",
            }}
          >
            {isSuccess ? "🎉 YOU GOT IT RIGHT!" : "❌ TRY AGAIN TOMORROW"}
          </h2>
        </div>
      </div>

      {/* Movie title reveal */}
      <div className="border-[3px] border-foreground rounded-lg px-6 py-4 bg-card comic-shadow-sm dark-glow-mustard">
        <p className="font-display text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
          {isSuccess ? "You nailed it!" : "The answer was"}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-comic-teal" />
          <p className="font-display text-2xl sm:text-3xl tracking-wide text-card-foreground">
            {movieTitle}
          </p>
        </div>
        <button
          onClick={handleShare}
          className="mt-3 w-full border-[2px] border-foreground rounded-md px-3 py-2 bg-[#111111] text-white text-sm font-sans hover:brightness-90 transition-all"
        >
          Share Result
        </button>
      </div>

      {/* Timer until next movie */}
      {timeUntilNext && (
        <div className="w-full border-[3px] border-foreground rounded-lg px-6 py-5 bg-card comic-shadow-sm">
          <p className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground text-center mb-2">Next movie in</p>
          <p className="font-display text-5xl tracking-wider text-center text-foreground font-mono" style={{ letterSpacing: "0.15em" }}>
            {timeUntilNext}
          </p>
        </div>
      )}
    </div>
  )
}
