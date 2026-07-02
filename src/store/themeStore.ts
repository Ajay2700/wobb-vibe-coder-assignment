import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode } from "@/types";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
      cycle: () => {
        const order: ThemeMode[] = ["light", "dark", "system"];
        const idx = order.indexOf(get().mode);
        set({ mode: order[(idx + 1) % order.length] });
      },
    }),
    {
      name: "wobb-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement | null;
  if (meta) meta.content = dark ? "#0b0b12" : "#ffffff";
}

/** Bind the store to the <html> class + respond to system preference changes. */
export function useThemeEffect(): void {
  const mode = useThemeStore((s) => s.mode);
  useEffect(() => {
    applyTheme(mode);
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [mode]);
}
