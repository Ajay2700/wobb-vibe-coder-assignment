import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark as BookmarkIcon,
  Users,
  TrendingUp,
  Hash,
} from "lucide-react";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { AddToListButton } from "@/components/AddToListButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCompact, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

type Status = "loading" | "ready" | "error";

function isPlatform(v: string | null): v is Platform {
  return v === "instagram" || v === "youtube" || v === "tiktok";
}

export function ProfileDetailPage() {
  const { username = "" } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform");
  const platform: Platform = isPlatform(platformParam) ? platformParam : "instagram";

  const [snapshot, setSnapshot] = useState<{
    username: string;
    status: Status;
    data: ProfileDetailResponse | null;
  }>({ username, status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    loadProfileByUsername(username)
      .then((data) => {
        if (cancelled) return;
        setSnapshot({ username, status: data ? "ready" : "error", data });
      })
      .catch(() => {
        if (!cancelled) setSnapshot({ username, status: "error", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const isStale = snapshot.username !== username;
  const status: Status = isStale ? "loading" : snapshot.status;
  const profileData: ProfileDetailResponse | null = isStale ? null : snapshot.data;

  useEffect(() => {
    if (profileData?.data.user_profile) {
      document.title = `@${profileData.data.user_profile.username} · Wobb`;
    }
  }, [profileData]);

  const user = profileData?.data.user_profile;
  const stats = useMemo(() => (user ? buildStats(user) : []), [user]);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to={`/?platform=${platform}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to search
        </Link>

        {status === "loading" && <ProfileDetailSkeleton />}

        {status === "error" && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="text-4xl">🫥</div>
            <h1 className="mt-3 text-xl font-semibold text-[rgb(var(--text))]">
              We couldn't find @{username}
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              The creator may not be indexed yet, or the URL is misspelled.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
            >
              Back to discovery
            </Link>
          </div>
        )}

        {status === "ready" && user && (
          <article className="animate-fade-in">
            <header
              className={cn(
                "relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-6 sm:p-8"
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[120%] -translate-x-1/2 opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgb(var(--accent) / 0.5), transparent 70%)",
                }}
              />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar
                  src={user.picture}
                  alt={user.fullname}
                  size={112}
                  className="ring-4 ring-[rgb(var(--surface))]"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{getPlatformLabel(platform)}</Badge>
                    {user.is_business && <Badge tone="neutral">Business</Badge>}
                    {user.language?.name && <Badge tone="neutral">{user.language.name}</Badge>}
                    {user.age_group && <Badge tone="neutral">{user.age_group}</Badge>}
                  </div>
                  <h1 className="mt-2 flex flex-wrap items-center gap-1.5 text-2xl font-bold text-[rgb(var(--text))] sm:text-3xl">
                    {user.fullname || `@${user.username}`}
                    <VerifiedBadge verified={user.is_verified} size={22} />
                  </h1>
                  <p className="text-sm text-[rgb(var(--text-muted))]">@{user.username}</p>

                  {user.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--text-muted))]">
                      {user.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <AddToListButton profile={user} platform={platform} variant="full" />
                    {user.url && (
                      <a
                        href={user.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] px-5 text-sm font-medium text-[rgb(var(--text))] transition-colors hover:bg-[rgb(var(--surface-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                        View on {getPlatformLabel(platform)}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-4"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[rgb(var(--text-subtle))]">
                    {s.icon}
                    {s.label}
                  </div>
                  <div className="mt-1 text-xl font-semibold tabular-nums text-[rgb(var(--text))]">
                    {s.value}
                  </div>
                  {s.hint && (
                    <div className="mt-0.5 text-xs text-[rgb(var(--text-subtle))]">{s.hint}</div>
                  )}
                </div>
              ))}
            </section>

            {user.stat_history && user.stat_history.length > 1 && (
              <FollowerTrend history={user.stat_history} />
            )}
          </article>
        )}
      </div>
    </Layout>
  );
}

function buildStats(user: FullUserProfile) {
  return [
    {
      label: "Followers",
      value: formatCompact(user.followers),
      icon: <Users className="h-3.5 w-3.5" aria-hidden />,
    },
    {
      label: "Engagement rate",
      value: formatEngagementRate(user.engagement_rate),
      icon: <TrendingUp className="h-3.5 w-3.5" aria-hidden />,
      hint: user.engagements !== undefined ? `${formatCompact(user.engagements)} engagements` : undefined,
    },
    {
      label: "Avg. likes",
      value: formatCompact(user.avg_likes),
      icon: <Heart className="h-3.5 w-3.5" aria-hidden />,
    },
    {
      label: "Avg. comments",
      value: formatCompact(user.avg_comments),
      icon: <MessageCircle className="h-3.5 w-3.5" aria-hidden />,
    },
    user.avg_views && user.avg_views > 0
      ? {
          label: "Avg. views",
          value: formatCompact(user.avg_views),
          icon: <Eye className="h-3.5 w-3.5" aria-hidden />,
        }
      : null,
    user.posts_count !== undefined
      ? {
          label: "Posts",
          value: formatCompact(user.posts_count),
          icon: <Hash className="h-3.5 w-3.5" aria-hidden />,
        }
      : null,
    user.avg_shares !== undefined
      ? {
          label: "Avg. shares",
          value: formatCompact(user.avg_shares),
          icon: <Share2 className="h-3.5 w-3.5" aria-hidden />,
        }
      : null,
    user.avg_saves !== undefined
      ? {
          label: "Avg. saves",
          value: formatCompact(user.avg_saves),
          icon: <BookmarkIcon className="h-3.5 w-3.5" aria-hidden />,
        }
      : null,
  ].filter((v): v is NonNullable<typeof v> => v !== null);
}

function FollowerTrend({ history }: { history: NonNullable<FullUserProfile["stat_history"]> }) {
  const points = history
    .filter((h) => h.followers !== undefined)
    .slice(-12) as Array<{ month: string; followers: number }>;
  if (points.length < 2) return null;

  const w = 800;
  const h = 160;
  const padX = 16;
  const padY = 24;
  const values = points.map((p) => p.followers);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (w - padX * 2) / (points.length - 1);

  const linePath = points
    .map((p, i) => {
      const x = padX + i * step;
      const y = h - padY - ((p.followers - min) / span) * (h - padY * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${(padX + (points.length - 1) * step).toFixed(1)},${h - padY} L${padX},${h - padY} Z`;

  const first = points[0].followers;
  const last = points[points.length - 1].followers;
  const growth = ((last - first) / first) * 100;

  return (
    <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-[rgb(var(--text))]">Follower trend</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-[rgb(var(--text-muted))]">
            {points[0].month} → {points[points.length - 1].month}
          </span>
          <Badge tone={growth >= 0 ? "success" : "danger"}>
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </Badge>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-3 h-40 w-full"
        role="img"
        aria-label="Follower trend chart"
      >
        <defs>
          <linearGradient id="wobb-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(139 61 255 / 0.35)" />
            <stop offset="100%" stopColor="rgb(139 61 255 / 0)" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#wobb-grad)" />
        <path
          d={linePath}
          fill="none"
          stroke="rgb(139 61 255)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </section>
  );
}

function ProfileDetailSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton circle className="h-28 w-28" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full max-w-lg" />
            <Skeleton className="h-3 w-3/4 max-w-md" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}
