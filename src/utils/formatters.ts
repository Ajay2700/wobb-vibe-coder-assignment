/** Compact number formatter — 1_234_567 → "1.2M". */
export function formatCompact(count: number | undefined | null): string {
  if (count === undefined || count === null || Number.isNaN(count)) return "—";
  const abs = Math.abs(count);
  if (abs >= 1_000_000_000) return trimZero((count / 1_000_000_000).toFixed(2)) + "B";
  if (abs >= 1_000_000) return trimZero((count / 1_000_000).toFixed(2)) + "M";
  if (abs >= 10_000) return trimZero((count / 1_000).toFixed(0)) + "K";
  if (abs >= 1_000) return trimZero((count / 1_000).toFixed(1)) + "K";
  return String(count);
}

/** Follower-labelled compact — "1.2M followers". */
export function formatFollowers(count: number | undefined | null): string {
  return `${formatCompact(count)} followers`;
}

/** Engagement rate is stored as a fraction (0.0142 = 1.42%). */
export function formatEngagementRate(rate: number | undefined | null): string {
  if (rate === undefined || rate === null || Number.isNaN(rate)) return "—";
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatRelativeTime(ts: number): string {
  const seconds = Math.round((Date.now() - ts) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(ts).toLocaleDateString();
}

function trimZero(s: string): string {
  return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
