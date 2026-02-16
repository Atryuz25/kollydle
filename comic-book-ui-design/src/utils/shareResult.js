export function generateShareText({ dateStr, guesses = [], gameStatus, dailyTitle }) {
  const header = `Kollydle – ${dateStr}`;
  const lines = [header, ""]; 

  if (gameStatus === "won") {
    guesses.forEach(g => {
      const ok = g && g.trim().toLowerCase() === (dailyTitle || "").trim().toLowerCase();
      lines.push(ok ? "🟩" : "🟨");
    });
    lines.push("");
    lines.push(`I guessed it in ${guesses.length}/${5}!`);
  } else if (gameStatus === "lost") {
    const row = Array(5).fill("❌").join(' ');
    lines.push(row);
    lines.push("");
    lines.push(`The answer was: ${dailyTitle}`);
  } else {
    guesses.forEach(g => lines.push("🟨"));
    lines.push("");
    lines.push(`Guesses: ${guesses.length}/5`);
  }

  return lines.join("\n");
}

export async function copyShareTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}
