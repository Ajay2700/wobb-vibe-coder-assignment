import { SearchX } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { EmptyState } from "./ui/EmptyState";
import { ProfileCardSkeleton } from "./ui/Skeleton";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  isLoading?: boolean;
  onClearFilters?: () => void;
}

export function ProfileList({ profiles, platform, isLoading, onClearFilters }: ProfileListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-6 w-6" aria-hidden />}
        title="No creators match your filters"
        description="Try broadening your search, lowering the follower threshold, or clearing the verified filter."
        action={
          onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-9 items-center rounded-lg bg-brand-500/10 px-3 text-sm font-medium text-brand-600 hover:bg-brand-500/15 dark:text-brand-300"
            >
              Clear filters
            </button>
          )
        }
      />
    );
  }

  return (
    <div
      role="list"
      className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {profiles.map((profile, index) => (
        <div role="listitem" key={profile.user_id}>
          <ProfileCard profile={profile} platform={platform} rank={index + 1} />
        </div>
      ))}
    </div>
  );
}
