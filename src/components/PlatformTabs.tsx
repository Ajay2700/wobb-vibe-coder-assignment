import { motion } from "framer-motion";
import { Instagram, Youtube, Music2 } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS } from "@/types";
import { springSnappy } from "@/lib/motionPresets";
import { cn } from "@/utils/cn";

interface PlatformTabsProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  counts?: Record<Platform, number>;
}

const META: Record<Platform, { label: string; Icon: typeof Instagram }> = {
  instagram: { label: "Instagram", Icon: Instagram },
  youtube: { label: "YouTube", Icon: Youtube },
  tiktok: { label: "TikTok", Icon: Music2 },
};

export function PlatformTabs({ selected, onChange, counts }: PlatformTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Platform"
      className="inline-flex items-center gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-1"
    >
      {PLATFORMS.map((p) => {
        const { label, Icon } = META[p];
        const active = p === selected;
        return (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${p}`}
            id={`tab-${p}`}
            onClick={() => onChange(p)}
            className={cn(
              "relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              active
                ? "text-[rgb(var(--text))]"
                : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
            )}
          >
            {active && (
              <motion.span
                layoutId="platform-tab-pill"
                className="absolute inset-0 rounded-lg bg-[rgb(var(--surface))] shadow-sm ring-1 ring-[rgb(var(--border-strong))]"
                transition={springSnappy}
                aria-hidden
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" aria-hidden />
              <span>{label}</span>
              {counts && counts[p] !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    active
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                      : "text-[rgb(var(--text-subtle))]"
                  )}
                >
                  {counts[p]}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
