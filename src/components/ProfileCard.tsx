import { memo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { VerifiedBadge } from "./VerifiedBadge";
import { Avatar } from "./ui/Avatar";
import { AddToListButton } from "./AddToListButton";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  rank?: number;
}

function ProfileCardImpl({ profile, platform, rank }: ProfileCardProps) {
  const to = `/profile/${encodeURIComponent(profile.username)}?platform=${platform}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5",
        "focus-within:border-brand-500/30 focus-within:shadow-lg"
      )}
    >
      <Link
        to={to}
        className="flex flex-1 flex-col rounded-2xl p-4 focus:outline-none"
        aria-label={`View ${profile.fullname} (@${profile.username})`}
      >
        <div className="flex items-start gap-3">
          <Avatar src={profile.picture} alt={profile.fullname} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate font-semibold text-[rgb(var(--text))]">
                {profile.fullname || `@${profile.username}`}
              </p>
              <VerifiedBadge verified={profile.is_verified} />
            </div>
            <p className="truncate text-sm text-[rgb(var(--text-muted))]">
              @{profile.username}
            </p>
          </div>
          {rank !== undefined && (
            <span className="rounded-md bg-[rgb(var(--surface-muted))] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-[rgb(var(--text-subtle))]">
              #{rank}
            </span>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-muted))] p-2.5">
            <dt className="flex items-center gap-1 text-[rgb(var(--text-subtle))]">
              <Users className="h-3 w-3" aria-hidden />
              Followers
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-[rgb(var(--text))]">
              {formatCompact(profile.followers)}
            </dd>
          </div>
          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-muted))] p-2.5">
            <dt className="flex items-center gap-1 text-[rgb(var(--text-subtle))]">
              <TrendingUp className="h-3 w-3" aria-hidden />
              Engagement
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-[rgb(var(--text))]">
              {formatEngagementRate(profile.engagement_rate)}
            </dd>
          </div>
        </dl>
      </Link>

      <div className="absolute right-3 top-3">
        <AddToListButton profile={profile} platform={platform} />
      </div>
    </article>
  );
}

export const ProfileCard = memo(ProfileCardImpl);
