import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { springSnappy } from "@/lib/motionPresets";
import { cn } from "@/utils/cn";

interface FilterPanelProps {
  verifiedOnly: boolean;
  onVerifiedChange: (v: boolean) => void;
  minFollowers: number;
  onMinFollowersChange: (v: number) => void;
}

const FOLLOWER_BUCKETS: Array<{ label: string; value: number }> = [
  { label: "Any", value: 0 },
  { label: "10K+", value: 10_000 },
  { label: "100K+", value: 100_000 },
  { label: "1M+", value: 1_000_000 },
  { label: "10M+", value: 10_000_000 },
];

export function FilterPanel({
  verifiedOnly,
  onVerifiedChange,
  minFollowers,
  onMinFollowersChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <motion.button
        type="button"
        onClick={() => onVerifiedChange(!verifiedOnly)}
        aria-pressed={verifiedOnly}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={springSnappy}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors",
          verifiedOnly
            ? "border-brand-500/40 bg-brand-500/10 text-brand-600 dark:text-brand-300"
            : "border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
        )}
      >
        <motion.span
          animate={{ rotate: verifiedOnly ? 0 : -20, scale: verifiedOnly ? 1 : 0.9 }}
          transition={springSnappy}
          className="inline-flex"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
        </motion.span>
        Verified only
      </motion.button>

      <div
        className="relative inline-flex h-11 items-center gap-0.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-1"
        role="radiogroup"
        aria-label="Minimum followers"
      >
        {FOLLOWER_BUCKETS.map((b) => {
          const active = b.value === minFollowers;
          return (
            <motion.button
              key={b.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onMinFollowersChange(b.value)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={springSnappy}
              className={cn(
                "relative inline-flex h-9 items-center rounded-lg px-2.5 text-xs font-medium tabular-nums transition-colors",
                active
                  ? "text-[rgb(var(--text))]"
                  : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-followers-pill"
                  transition={springSnappy}
                  className="absolute inset-0 rounded-lg bg-[rgb(var(--surface))] shadow-sm ring-1 ring-[rgb(var(--border-strong))]"
                  aria-hidden
                />
              )}
              <span className="relative">{b.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
