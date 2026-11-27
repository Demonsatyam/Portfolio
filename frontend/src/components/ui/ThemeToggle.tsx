"use client";

function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === "light" ? "dark" : "light";
  html.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

/** Sun in dark mode, moon in light mode; colour comes from the parent's text colour. */
export function ThemeToggle({ className = "text-muted hover:text-fg" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Toggle light and dark mode"
      onClick={toggleTheme}
      className={`grid size-10 place-items-center rounded-full transition-colors ${className}`}
    >
      <svg className="size-5 light:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="hidden size-5 light:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
