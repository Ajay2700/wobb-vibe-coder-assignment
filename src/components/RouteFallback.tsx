export function RouteFallback() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent"
      role="progressbar"
      aria-label="Loading page"
    >
      <div className="h-full w-1/3 animate-[shimmer_1.2s_linear_infinite] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
    </div>
  );
}
