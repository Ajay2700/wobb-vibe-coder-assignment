import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className, circle }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("skeleton", circle ? "rounded-full" : "rounded-lg", className)}
    />
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-4">
      <div className="flex items-start gap-4">
        <Skeleton circle className="h-14 w-14" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </div>
  );
}
