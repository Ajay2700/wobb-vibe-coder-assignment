import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { ThemeMode } from "@/types";
import { cn } from "@/utils/cn";

const ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeMode, string> = {
  light: "Switch to dark",
  dark: "Switch to system",
  system: "Switch to light",
};

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useThemeStore((s) => s.mode);
  const cycle = useThemeStore((s) => s.cycle);
  const Icon = ICONS[mode];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABELS[mode]}
      title={`Theme: ${mode}`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--text-muted))]",
        "transition-colors hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--text))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
