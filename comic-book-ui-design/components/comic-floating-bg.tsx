"use client"

import { useEffect, useState } from "react"

interface FloatingElement {
  id: number
  type: "word" | "star" | "circle" | "zigzag" | "filmstrip" | "burst" | "clapperboard"
  x: number
  y: number
  rotation: number
  scale: number
  delay: number
  duration: number
  text?: string
}

const COMIC_WORDS = ["POW!", "ZAP!", "CUT!", "ACTION!", "TAKE!", "SCENE!", "BOOM!", "WOW!", "HIT!"]

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function generateElements(): FloatingElement[] {
  const elements: FloatingElement[] = []
  let id = 0

  for (let i = 0; i < 7; i++) {
    elements.push({
      id: id++,
      type: "word",
      x: seededRandom(i * 7 + 1) * 88 + 6,
      y: seededRandom(i * 13 + 3) * 82 + 8,
      rotation: (seededRandom(i * 11 + 5) - 0.5) * 25,
      scale: 0.7 + seededRandom(i * 3 + 7) * 0.6,
      delay: seededRandom(i * 17 + 2) * 4,
      duration: 8 + seededRandom(i * 19 + 9) * 6,
      text: COMIC_WORDS[i % COMIC_WORDS.length],
    })
  }

  for (let i = 0; i < 10; i++) {
    elements.push({
      id: id++,
      type: "star",
      x: seededRandom(i * 23 + 11) * 92 + 4,
      y: seededRandom(i * 29 + 17) * 88 + 6,
      rotation: seededRandom(i * 31 + 19) * 360,
      scale: 0.5 + seededRandom(i * 37 + 23) * 0.7,
      delay: seededRandom(i * 41 + 29) * 5,
      duration: 7 + seededRandom(i * 43 + 31) * 7,
    })
  }

  for (let i = 0; i < 6; i++) {
    elements.push({
      id: id++,
      type: "circle",
      x: seededRandom(i * 47 + 37) * 90 + 5,
      y: seededRandom(i * 53 + 41) * 85 + 7,
      rotation: 0,
      scale: 0.5 + seededRandom(i * 59 + 43) * 0.9,
      delay: seededRandom(i * 61 + 47) * 6,
      duration: 10 + seededRandom(i * 67 + 53) * 6,
    })
  }

  for (let i = 0; i < 5; i++) {
    elements.push({
      id: id++,
      type: "zigzag",
      x: seededRandom(i * 71 + 59) * 88 + 6,
      y: seededRandom(i * 73 + 61) * 82 + 9,
      rotation: (seededRandom(i * 79 + 67) - 0.5) * 40,
      scale: 0.5 + seededRandom(i * 83 + 71) * 0.6,
      delay: seededRandom(i * 89 + 73) * 5,
      duration: 7 + seededRandom(i * 97 + 79) * 7,
    })
  }

  for (let i = 0; i < 4; i++) {
    elements.push({
      id: id++,
      type: "filmstrip",
      x: seededRandom(i * 101 + 83) * 86 + 7,
      y: seededRandom(i * 103 + 89) * 80 + 10,
      rotation: (seededRandom(i * 107 + 97) - 0.5) * 25,
      scale: 0.6 + seededRandom(i * 109 + 101) * 0.5,
      delay: seededRandom(i * 113 + 103) * 4,
      duration: 9 + seededRandom(i * 127 + 107) * 5,
    })
  }

  for (let i = 0; i < 5; i++) {
    elements.push({
      id: id++,
      type: "burst",
      x: seededRandom(i * 131 + 109) * 90 + 5,
      y: seededRandom(i * 137 + 113) * 86 + 7,
      rotation: seededRandom(i * 139 + 127) * 360,
      scale: 0.5 + seededRandom(i * 149 + 131) * 0.5,
      delay: seededRandom(i * 151 + 137) * 6,
      duration: 8 + seededRandom(i * 157 + 139) * 6,
    })
  }

  for (let i = 0; i < 3; i++) {
    elements.push({
      id: id++,
      type: "clapperboard",
      x: seededRandom(i * 163 + 149) * 85 + 7,
      y: seededRandom(i * 167 + 151) * 80 + 10,
      rotation: (seededRandom(i * 173 + 157) - 0.5) * 20,
      scale: 0.6 + seededRandom(i * 179 + 163) * 0.4,
      delay: seededRandom(i * 181 + 167) * 5,
      duration: 10 + seededRandom(i * 191 + 173) * 5,
    })
  }

  return elements
}

function StarSVG() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <polygon
        points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  )
}

function ZigzagSVG() {
  return (
    <svg viewBox="0 0 24 40" className="w-full h-full" aria-hidden="true">
      <polyline
        points="4,2 20,14 4,26 20,38"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilmStripSVG() {
  return (
    <svg viewBox="0 0 48 24" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="48" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="2" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="10" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="10" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="18" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="18" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="26" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="26" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="34" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="34" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="42" y="2" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="42" y="18" width="4" height="4" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function BurstSVG() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <polygon
        points="16,0 19,11 28,4 21,13 32,16 21,19 28,28 19,21 16,32 13,21 4,28 11,19 0,16 11,13 4,4 13,11"
        fill="currentColor"
      />
    </svg>
  )
}

function ClapperboardSVG() {
  return (
    <svg viewBox="0 0 32 28" className="w-full h-full" aria-hidden="true">
      <rect x="1" y="8" width="30" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <polygon points="1,8 7,1 13,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="9,8 15,1 21,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="17,8 23,1 29,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="8" x2="31" y2="8" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function ComicFloatingBg() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    setElements(generateElements())
  }, [])

  if (elements.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {elements.map((el) => {
        const sizeMap: Record<string, string> = {
          word: "auto",
          star: `${20 * el.scale}px`,
          circle: `${16 * el.scale}px`,
          zigzag: `${16 * el.scale}px`,
          filmstrip: `${44 * el.scale}px`,
          burst: `${22 * el.scale}px`,
          clapperboard: `${28 * el.scale}px`,
        }

        return (
          <div
            key={el.id}
            className="absolute comic-float-element"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              ["--float-rot" as string]: `${el.rotation}deg`,
              ["--float-dur" as string]: `${el.duration}s`,
              ["--float-delay" as string]: `${el.delay}s`,
            }}
          >
            {el.type === "word" && (
              <span
                className="font-display text-foreground/[0.09] dark:text-foreground/[0.12] select-none whitespace-nowrap"
                style={{
                  fontSize: `${el.scale * 32}px`,
                  WebkitTextStroke: `1.5px currentColor`,
                }}
              >
                {el.text}
              </span>
            )}

            {el.type === "star" && (
              <div
                className="text-[var(--comic-mustard)]/[0.14] dark:text-[var(--comic-mustard)]/[0.18]"
                style={{ width: sizeMap.star, height: sizeMap.star, opacity: 0.14 }}
              >
                <StarSVG />
              </div>
            )}

            {el.type === "circle" && (
              <div
                className="rounded-full border-[2.5px] border-current text-[var(--comic-red)]"
                style={{ width: sizeMap.circle, height: sizeMap.circle, opacity: 0.1 }}
              />
            )}

            {el.type === "zigzag" && (
              <div
                className="text-[var(--comic-teal)]"
                style={{ width: sizeMap.zigzag, height: `${26 * el.scale}px`, opacity: 0.12 }}
              >
                <ZigzagSVG />
              </div>
            )}

            {el.type === "filmstrip" && (
              <div
                className="text-foreground"
                style={{ width: sizeMap.filmstrip, height: `${22 * el.scale}px`, opacity: 0.08 }}
              >
                <FilmStripSVG />
              </div>
            )}

            {el.type === "burst" && (
              <div
                className="text-[var(--comic-mustard)]"
                style={{ width: sizeMap.burst, height: sizeMap.burst, opacity: 0.1 }}
              >
                <BurstSVG />
              </div>
            )}

            {el.type === "clapperboard" && (
              <div
                className="text-[var(--comic-red)]"
                style={{ width: sizeMap.clapperboard, height: `${24 * el.scale}px`, opacity: 0.1 }}
              >
                <ClapperboardSVG />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
