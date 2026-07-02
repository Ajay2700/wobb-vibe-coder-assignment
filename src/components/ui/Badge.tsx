import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  neutral:
    "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] border border-[rgb(var(--border))]",
  brand: "bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20",
};

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
