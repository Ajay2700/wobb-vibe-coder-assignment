import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Flame, TrendingUp, Users } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { springSnappy } from "@/lib/motionPresets";
import { cn } from "@/utils/cn";
import { VerifiedBadge } from "./VerifiedBadge";
import { Avatar } from "./ui/Avatar";
import { AddToListButton } from "./AddToListButton";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  rank?: number;
  trending?: boolean;
}

function ProfileCardImpl({ profile, platform, rank, trending }: ProfileCardProps) {
  const to = `/profile/${encodeURIComponent(profile.username)}?platform=${platform}`;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={springSnappy}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-[rgb(var(--surface-elev))]",
        "shadow-sm shadow-transparent transition-colors duration-200 hover:shadow-lg hover:shadow-brand-500/10",
        "focus-within:shadow-lg",
        trending
          ? "border-brand-500/40"
          : "border-[rgb(var(--border))] hover:border-brand-500/30 focus-within:border-brand-500/30"
      )}
    >
      {trending && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.35), transparent 70%)",
          }}
        />
      )}

      <Link
        to={to}
        className="relative flex flex-1 flex-col rounded-2xl p-4 focus:outline-none"
        aria-label={`View ${profile.fullname} (@${profile.username})`}
      >
        <div className="flex items-start gap-3">
          <Avatar src={profile.picture} alt={profile.fullname} size={52} />
          <div className="min-w-0 flex-1 pr-10">
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

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {trending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                <Flame className="h-3 w-3" aria-hidden />
                Trending
              </span>
            )}
            {rank !== undefined && (
              <span className="rounded-md bg-[rgb(var(--surface-muted))] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-[rgb(var(--text-subtle))]">
                #{rank}
              </span>
            )}
          </div>
          <span
            aria-hidden
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-brand-300"
          >
            View
            <ChevronRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <AddToListButton profile={profile} platform={platform} />
      </div>
    </motion.article>
  );
}

export const ProfileCard = memo(ProfileCardImpl);
