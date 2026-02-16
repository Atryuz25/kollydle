import React, { useEffect, useMemo, useState } from "react";

export default function Autocomplete({ titles = [], value, onChange, onSelect, placeholder = "Guess the movie...", disabled = false }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => setQuery(value || ""), [value]);

  const suggestions = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return titles.filter(t => t.toLowerCase().includes(q)).slice(0, 8);
  }, [titles, query]);

  useEffect(() => setActiveIndex(-1), [suggestions]);

  function handleInputChange(e) {
    setQuery(e.target.value);
    onChange && onChange(e.target.value);
    setOpen(true);
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        choose(suggestions[activeIndex]);
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function choose(item) {
    setQuery(item);
    onChange && onChange(item);
    onSelect && onSelect(item);
    setOpen(false);
  }

  return (
    <div className="autocomplete" style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        aria-autocomplete="list"
        aria-expanded={open}
      />
      {open && suggestions.length > 0 && (
        <ul className="autocomplete-list" style={{ position: "absolute", zIndex: 40, background: "white", listStyle: "none", padding: 0, margin: 0, width: "100%", border: "1px solid #ddd" }}>
          {suggestions.map((s, idx) => (
            <li
              key={s}
              onMouseDown={(e) => { e.preventDefault(); choose(s); }}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{ padding: "8px", background: idx === activeIndex ? "#eee" : "white", cursor: "pointer" }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
