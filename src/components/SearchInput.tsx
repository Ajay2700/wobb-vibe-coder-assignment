import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search by username or full name…",
  className,
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl + K focus shortcut.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
        ref.current?.select();
      }
      if (e.key === "Escape" && document.activeElement === ref.current) {
        onChange("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-subtle))]"
        aria-hidden
      />
      <input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search creators"
        className="h-11 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] pl-9 pr-24 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-subtle))] transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="rounded-md p-1 text-[rgb(var(--text-subtle))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--text))]"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
        <kbd className="hidden select-none rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--surface-muted))] px-1.5 py-0.5 font-mono text-[10px] text-[rgb(var(--text-subtle))] sm:inline">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
