import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-brand-500 focus-visible:ring-offset-[rgb(var(--surface))] " +
  "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95",
  secondary:
    "bg-[rgb(var(--surface-elev))] text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:border-[rgb(var(--border-strong))] hover:bg-[rgb(var(--surface-muted))]",
  outline:
    "bg-transparent text-[rgb(var(--text))] border border-[rgb(var(--border-strong))] hover:bg-[rgb(var(--surface-muted))]",
  ghost:
    "bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-muted))]",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/15",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    children,
    leftIcon,
    rightIcon,
    isLoading,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});
