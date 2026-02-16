"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ComicAttempts } from "./comic-attempts"
import { ComicHintCard } from "./comic-hint-card"
import { ComicResultBanner } from "./comic-result-banner"
import { Search, ArrowRight } from "lucide-react"
import useKollywoodle from "@/src/hooks/useKollywoodle"

const MAX_ATTEMPTS = 5

type GameState = "playing" | "won" | "lost"

export function ComicGamePanel() {
  const {
    dailyMovie,
    titles,
    guesses,
    revealedClues,
    gameStatus,
    submitGuess,
    resetGame,
    getCluesArray,
  } = useKollywoodle()

  const [guess, setGuess] = useState("")
  const [shaking, setShaking] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [timeUntilNext, setTimeUntilNext] = useState("00:00:00")
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // countdown timer until next movie (midnight IST)
  useEffect(() => {
    function updateTimer() {
      const now = new Date()
      const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      const tomorrow = new Date(istNow)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - istNow.getTime()
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeUntilNext(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`)
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (guess.trim().length > 0) {
      setShowSuggestions(titles && titles.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [guess, titles])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!dailyMovie || gameStatus !== "playing" || guess.trim() === "") return

    const res = submitGuess(guess)
    setShowSuggestions(false)
    if (res.ok && !res.correct) {
      setShaking(true)
      setTimeout(() => setShaking(false), 400)
    }
    setGuess("")
  }, [guess, submitGuess, dailyMovie, gameStatus])

  const selectSuggestion = (movie: string) => {
    setGuess(movie)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const visibleHints = useMemo(() => {
    if (!dailyMovie) return []
    const clues = getCluesArray(dailyMovie)
    const labels = ["Plot", "Genre", "Lead Actor", "Director", "Year"]
    return clues.map((val, i) => ({ label: labels[i], value: val }))
  }, [dailyMovie, getCluesArray])

  const attemptResults = useMemo(() => {
    if (!dailyMovie) return Array(MAX_ATTEMPTS).fill("unused") as ("correct" | "wrong" | "unused")[]
    const movie = dailyMovie as { title: string }
    const res: ("correct" | "wrong" | "unused")[] = guesses.map((g: string) => (g.trim().toLowerCase() === movie.title.toLowerCase() ? "correct" : "wrong"))
    while (res.length < MAX_ATTEMPTS) res.push("unused")
    return res
  }, [guesses, dailyMovie])

  return (
    <div className="w-full max-w-[580px] mx-auto px-4">
      {/* Main panel frame with accent top bar */}
      <div
        className={cn(
          "relative border-[4px] border-foreground rounded-xl overflow-hidden comic-shadow dark-glow-mustard transition-transform duration-300",
          shaking && "animate-wrong-shake"
        )}
      >
        {/* Colored top strip */}
        <div className="flex h-2">
          <div className="flex-1 bg-comic-red" />
          <div className="flex-1 bg-comic-mustard" />
          <div className="flex-1 bg-comic-teal" />
        </div>

        {/* Halftone inside panel */}
        <div className="halftone absolute inset-0 pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-7 bg-card flex flex-col gap-6">
          {/* Attempts indicator */}
          <ComicAttempts
            total={MAX_ATTEMPTS}
            used={guesses.length}
            results={attemptResults}
          />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-foreground/15" />
            <span className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">Clues</span>
            <div className="flex-1 h-px bg-foreground/15" />
          </div>

          {/* Hints section */}
          <div className="flex flex-col gap-3" role="region" aria-label="Movie hints">
            {visibleHints.map((hint, i) => (
              <ComicHintCard
                key={hint.label}
                label={hint.label}
                value={hint.value}
                visible
                index={i}
              />
            ))}
            {/* Locked hint placeholders */}
            {gameStatus === "playing" &&
              Array.from({ length: MAX_ATTEMPTS - visibleHints.length }).map((_, i) => (
                <div
                  key={`locked-${i}`}
                  className="relative border-[3px] border-dashed border-foreground/20 rounded-lg p-4 flex items-center gap-2 text-muted-foreground/50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="font-sans text-xs">
                    Clue unlocks after attempt {visibleHints.length + i + 1}
                  </span>
                </div>
              ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-foreground/15" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-comic-mustard" aria-hidden="true">
              <polygon
                points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
                fill="currentColor"
              />
            </svg>
            <div className="flex-1 h-px bg-foreground/15" />
          </div>

          {/* Game result or input */}
          {gameStatus !== "playing" ? (
            <ComicResultBanner
              type={gameStatus === "won" ? "success" : "failure"}
              movieTitle={dailyMovie ? (dailyMovie as { title: string }).title : ""}
              guesses={guesses}
              gameStatus={gameStatus}
              dailyMovieTitle={dailyMovie ? (dailyMovie as { title: string }).title : undefined}
              timeUntilNext={timeUntilNext}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {/* Input field with autocomplete */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search
                    className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit()
                    }}
                    onFocus={() => {
                      if (titles && titles.length > 0 && guess.trim().length > 0) {
                        setShowSuggestions(true)
                      }
                    }}
                    placeholder="Type your blockbuster guess..."
                    className="w-full border-[3px] border-foreground rounded-lg pl-10 pr-4 py-3.5 bg-background text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-comic-teal focus:ring-offset-1 focus:ring-offset-background focus:border-foreground transition-all duration-200"
                    aria-label="Movie guess input"
                    autoComplete="off"
                  />
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && titles && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-20 top-full mt-1 w-full border-[3px] border-foreground rounded-lg bg-card comic-shadow-sm overflow-hidden max-h-[200px] overflow-y-auto"
                  >
                    {titles
                      .filter(t => t.toLowerCase().includes(guess.toLowerCase()))
                      .slice(0, 8)
                      .map((movie) => (
                        <button
                          key={movie}
                          onClick={() => selectSuggestion(movie)}
                          className="w-full text-left px-4 py-2.5 font-sans text-sm text-card-foreground hover:bg-primary hover:text-primary-foreground transition-colors border-b border-border last:border-b-0"
                        >
                          {movie}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={guess.trim() === ""}
                className={cn(
                  "w-full border-[3px] border-foreground rounded-lg py-3.5 font-display text-lg tracking-wider comic-shadow transition-all duration-150 flex items-center justify-center gap-2",
                  guess.trim() === ""
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-comic-mustard text-[#111111] comic-press cursor-pointer hover:brightness-105"
                )}
              >
                <span>Lock It In!</span>
                {guess.trim() !== "" && (
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-comic-red/40 rounded-full" />
          <div className="w-6 h-0.5 bg-comic-mustard/40 rounded-full" />
          <div className="w-6 h-0.5 bg-comic-teal/40 rounded-full" />
        </div>
        <p className="font-sans text-xs text-muted-foreground">
          A new movie every day. Come back tomorrow!
        </p>
      </footer>
    </div>
  )
}
