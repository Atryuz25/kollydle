import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "kollydle_v1";
const START_DATE_ISO = "2025-01-01T00:00:00Z";
const MAX_CLUES = 5;
const MAX_GUESSES = 5;

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let cur = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        values.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    values.push(cur.trim());
    if (values.length === header.length) {
      const obj = {};
      for (let k = 0; k < header.length; k++) {
        obj[header[k]] = values[k];
      }
      if (obj.year) obj.year = Number(obj.year);
      rows.push(obj);
    }
  }
  return rows;
}

async function fetchMoviesCsvOrFallback() {
  try {
    const resp = await fetch("/movies.csv");
    if (!resp.ok) throw new Error("no csv");
    const text = await resp.text();
    const parsed = parseCSV(text);
    if (parsed.length > 0) return parsed;
  } catch (e) {
    // ignore, fallback
  }

  return [
    {
      title: "Jai Bhim",
      plot: "A determined lawyer fights for justice for marginalized people after a wrongful arrest.",
      genre: "Drama",
      leadActor: "Suriya",
      director: "T.J. Gnanavel",
      year: 2021
    },
    {
      title: "Kaithi",
      plot: "An ex-convict must navigate a dangerous night to protect innocent people and reunite with his family.",
      genre: "Action",
      leadActor: "Karthi",
      director: "Lokesh Kanagaraj",
      year: 2019
    }
  ];
}

function getTodayISTString() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function computeMovieIndex(startISO, moviesLength) {
  if (moviesLength <= 0) return 0;

  const todayIST = getTodayISTString();
  const todayDate = new Date(todayIST + "T00:00:00Z");
  const start = new Date(startISO);
  const diffTime = todayDate - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Seeded random number generator using the day number as seed
  // This ensures everyone gets the same "random" movie on the same day
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Use multiple iterations to get better randomness
  let randomValue = seededRandom(diffDays + 12345);
  randomValue = seededRandom(randomValue * 100000);

  return Math.floor(randomValue * moviesLength);
}

export default function useKollywoodle() {
  const [movies, setMovies] = useState([]);
  const [dailyMovie, setDailyMovie] = useState(null);

  const [guesses, setGuesses] = useState([]);
  const [revealedClues, setRevealedClues] = useState(1);
  const [gameStatus, setGameStatus] = useState("playing");
  const [titles, setTitles] = useState([]);

  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = await fetchMoviesCsvOrFallback();
      if (!mounted) return;
      setMovies(loaded);
      setTitles(loaded.map(m => m.title));
      const idx = computeMovieIndex(START_DATE_ISO, loaded.length);
      setDailyMovie(loaded[idx]);
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (!dailyMovie) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const today = getTodayISTString();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today) {
          setGuesses(parsed.guesses || []);
          setGameStatus(parsed.gameStatus || "playing");
          setRevealedClues(Math.max(1, parsed.revealedClues || 1));
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    const init = { date: today, guesses: [], gameStatus: "playing", revealedClues: 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    setGuesses([]);
    setGameStatus("playing");
    setRevealedClues(1);
  }, [dailyMovie]);

  useEffect(() => {
    if (!dailyMovie) return;
    const today = getTodayISTString();
    const payload = { date: today, guesses, gameStatus, revealedClues };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [dailyMovie, guesses, gameStatus, revealedClues]);

  function normalize(s) {
    return (s || "").trim().toLowerCase();
  }

  function getCluesArray(movie) {
    if (!movie) return [];
    const arr = [movie.plot, movie.genre, movie.leadActor, movie.director, String(movie.year)];
    return arr.slice(0, revealedClues);
  }

  function submitGuess(rawGuess) {
    if (!dailyMovie || gameStatus !== "playing") return { ok: false, reason: "not-playing" };
    const normalizedGuess = normalize(rawGuess);
    if (!normalizedGuess) return { ok: false, reason: "empty" };

    const normalizedAnswer = normalize(dailyMovie.title);
    if (guesses.some(g => normalize(g) === normalizedGuess)) return { ok: false, reason: "duplicate" };

    if (normalizedGuess === normalizedAnswer) {
      setGuesses(prev => [...prev, rawGuess.trim()]);
      setGameStatus("won");
      setRevealedClues(MAX_CLUES);
      return { ok: true, correct: true };
    }

    const newGuesses = [...guesses, rawGuess.trim()];
    setGuesses(newGuesses);

    if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus("lost");
      setRevealedClues(MAX_CLUES);
    } else {
      setRevealedClues(rc => rc + 1);
    }

    return { ok: true, correct: false };
  }

  function resetGame() {
    const today = getTodayISTString();
    const init = { date: today, guesses: [], gameStatus: "playing", revealedClues: 1 };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    } catch (e) { }
    setGuesses([]);
    setGameStatus("playing");
    setRevealedClues(1);
  }

  return {
    dailyMovie,
    movies,
    titles,
    guesses,
    revealedClues,
    gameStatus,
    submitGuess,
    resetGame,
    getCluesArray
  };
}
