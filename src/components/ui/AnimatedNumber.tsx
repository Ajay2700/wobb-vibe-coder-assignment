import { useCountUp } from "@/hooks/useCountUp";
import { formatCompact } from "@/utils/formatters";

interface AnimatedNumberProps {
  value: number;
  format?: "plain" | "compact";
  duration?: number;
  delay?: number;
  className?: string;
}

/** Animated number that counts from 0 → value on mount. */
export function AnimatedNumber({
  value,
  format = "plain",
  duration,
  delay,
  className,
}: AnimatedNumberProps) {
  const current = useCountUp(value, { duration, delay });
  const rendered = format === "compact" ? formatCompact(current) : String(current);
  return <span className={className}>{rendered}</span>;
}
