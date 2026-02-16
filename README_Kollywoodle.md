Kollywoodle (game logic)

Quick integration notes for the existing UI:

- Place your movies CSV at the site root as `/movies.csv` with header:
  `title,plot,genre,leadActor,director,year`

- Hook: `src/hooks/useKollywoodle.js`
  - Exports default hook returning:
    - `dailyMovie`, `movies`, `titles`, `guesses`, `revealedClues`, `gameStatus`
    - `submitGuess(rawGuess)` → { ok, correct }
    - `resetGame()`
    - `getCluesArray(movie)` → array of visible clues

- Autocomplete component: `src/components/Autocomplete.js`
  - Props: `titles`, `value`, `onChange`, `onSelect`, `disabled`

- Share util: `src/utils/shareResult.js`
  - `generateShareText({dateStr, guesses, gameStatus, dailyTitle})`
  - `copyShareTextToClipboard(text)`

Notes:
- Uses IST (`Asia/Kolkata`) date to decide daily puzzle and midnight reset.
- Local storage key: `kollywoodle_v1` stores `{date, guesses, gameStatus, revealedClues}`.
- Defaults to a small fallback movie list if `/movies.csv` is not present.
