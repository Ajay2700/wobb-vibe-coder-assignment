import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border-strong))] bg-[rgb(var(--surface-muted))] px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--surface-elev))] text-brand-500 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[rgb(var(--text))]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
