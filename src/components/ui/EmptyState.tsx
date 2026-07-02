import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpStagger, scaleIn } from "@/lib/motionPresets";
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
    <motion.div
      variants={fadeUpStagger}
      initial="hidden"
      animate="visible"
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border-strong))] bg-[rgb(var(--surface-muted))] px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <motion.div
          variants={scaleIn}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--surface-elev))] text-brand-500 shadow-sm"
        >
          {icon}
        </motion.div>
      )}
      <motion.h3 variants={fadeUp} className="text-lg font-semibold text-[rgb(var(--text))]">
        {title}
      </motion.h3>
      {description && (
        <motion.p variants={fadeUp} className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          {description}
        </motion.p>
      )}
      {action && (
        <motion.div variants={fadeUp} className="mt-5">
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
