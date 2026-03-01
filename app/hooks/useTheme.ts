"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

// Initialize theme from localStorage (runs once on mount)
function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  try {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // localStorage unavailable
  }
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Sync theme to localStorage and DOM when it changes
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setAndPersist = useCallback((next: Theme) => {
    setTheme(next);
  }, []);

  return { theme, setTheme: setAndPersist };
}
