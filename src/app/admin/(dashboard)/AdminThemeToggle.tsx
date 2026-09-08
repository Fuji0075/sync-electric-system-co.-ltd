"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "admin_theme";

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      // ignore — localStorage can throw in private-browsing edge cases
    }
    const initial = saved === "light" ? "light" : "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a per-viewer preference on mount, server has no access to it
    setTheme(initial);
    document.querySelectorAll(".admin-shell").forEach((el) => el.setAttribute("data-theme", initial));
  }, []);

  function toggle() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore
      }
      document.querySelectorAll(".admin-shell").forEach((el) => el.setAttribute("data-theme", next));
      return next;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "สลับเป็นโทนสว่าง" : "สลับเป็นโทนมืด"}
      title={theme === "dark" ? "สลับเป็นโทนสว่าง" : "สลับเป็นโทนมืด"}
      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--admin-border-strong)] text-[var(--admin-text-secondary)] hover:border-orange-400/40 hover:text-orange-400"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
