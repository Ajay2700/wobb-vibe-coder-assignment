import { ArrowUpDown } from "lucide-react";
import type { SortKey } from "@/types";

const OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "followers-desc", label: "Followers — high to low" },
  { value: "followers-asc", label: "Followers — low to high" },
  { value: "engagement-desc", label: "Engagement rate" },
  { value: "name-asc", label: "Name — A to Z" },
];

interface SortSelectProps {
  value: SortKey;
  onChange: (v: SortKey) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] pl-3 pr-2 text-sm text-[rgb(var(--text))] focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <ArrowUpDown className="h-4 w-4 text-[rgb(var(--text-subtle))]" aria-hidden />
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none bg-transparent pr-6 text-sm font-medium text-[rgb(var(--text))] focus:outline-none"
        aria-label="Sort creators"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 h-3 w-3 text-[rgb(var(--text-subtle))]"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 011.08 1.04l-4.24 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </label>
  );
}
