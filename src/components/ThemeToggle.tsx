import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { ThemeMode } from "@/types";
import { springSnappy } from "@/lib/motionPresets";
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
    <motion.button
      type="button"
      onClick={cycle}
      aria-label={LABELS[mode]}
      title={`Theme: ${mode}`}
      whileHover={{ scale: 1.08, rotate: 6 }}
      whileTap={{ scale: 0.92 }}
      transition={springSnappy}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-[rgb(var(--text-muted))]",
        "transition-colors hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--text))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={mode}
          initial={{ opacity: 0, y: -8, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 8, rotate: 20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inline-flex"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
