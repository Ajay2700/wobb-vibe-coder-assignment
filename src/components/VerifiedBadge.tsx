import { cn } from "@/utils/cn";

interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
  className?: string;
}

export function VerifiedBadge({ verified, size = 16, className }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className={cn("inline-flex items-center text-brand-500 dark:text-brand-300", className)}
      title="Verified account"
      aria-label="Verified account"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1.5 14.24 4l3.3-.44.44 3.3L20.5 9 18 12l2.5 3-2.52 1.63-.44 3.3-3.3-.44L12 22.5 9.76 20l-3.3.44-.44-3.3L3.5 15 6 12 3.5 9l2.52-1.63.44-3.3 3.3.44L12 1.5Zm-.9 13.6 5.3-5.3-1.4-1.4-3.9 3.9-1.7-1.7-1.4 1.4 3.1 3.1Z" />
      </svg>
    </span>
  );
}
