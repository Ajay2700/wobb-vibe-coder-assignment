export function RouteFallback() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-sm text-[rgb(var(--text-muted))]">Loading…</p>
    </div>
  );
}
