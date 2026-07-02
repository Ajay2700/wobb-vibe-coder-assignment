import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Download,
  ExternalLink,
  GripVertical,
  Share2,
  Trash2,
  Users,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Platform, ShortlistItem } from "@/types";
import { useShortlistStore } from "@/store/shortlistStore";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatCompact, formatEngagementRate, formatRelativeTime } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { downloadCsv, shortlistToCsv } from "@/utils/csv";
import { cn } from "@/utils/cn";

const PLATFORM_TONE: Record<Platform, "brand" | "neutral"> = {
  instagram: "brand",
  youtube: "brand",
  tiktok: "brand",
};

export function ShortlistPage() {
  const items = useShortlistStore((s) => s.items);
  const remove = useShortlistStore((s) => s.remove);
  const clear = useShortlistStore((s) => s.clear);
  const reorder = useShortlistStore((s) => s.reorder);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const summary = useMemo(() => {
    const total = items.length;
    const followers = items.reduce((sum, i) => sum + (i.followers || 0), 0);
    const rateValues = items.map((i) => i.engagement_rate).filter((r): r is number => r !== undefined);
    const avgRate = rateValues.length
      ? rateValues.reduce((a, b) => a + b, 0) / rateValues.length
      : undefined;
    const byPlatform = items.reduce<Record<string, number>>((acc, i) => {
      acc[i.platform] = (acc[i.platform] ?? 0) + 1;
      return acc;
    }, {});
    return { total, followers, avgRate, byPlatform };
  }, [items]);

  const onDragStart = (index: number) => (e: React.DragEvent<HTMLLIElement>) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const onDragOver = (index: number) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const onDrop = (index: number) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    const from = dragIndex ?? Number(e.dataTransfer.getData("text/plain"));
    setDragIndex(null);
    setDragOverIndex(null);
    if (Number.isNaN(from) || from === index) return;
    reorder(from, index);
  };

  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const onKeyReorder = useCallback(
    (index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        reorder(index, index - 1);
      } else if (e.key === "ArrowDown" && index < items.length - 1) {
        e.preventDefault();
        reorder(index, index + 1);
      }
    },
    [items.length, reorder]
  );

  const onExport = () => {
    if (!items.length) return;
    const csv = shortlistToCsv(items);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadCsv(`wobb-shortlist-${stamp}.csv`, csv);
    toast.success(`Exported ${items.length} creator${items.length === 1 ? "" : "s"} to CSV`);
  };

  const onShare = async () => {
    if (!items.length) return;
    const summaryText = items
      .map((i) => `@${i.username} (${getPlatformLabel(i.platform)}) — ${formatCompact(i.followers)}`)
      .join("\n");
    const text = `My Wobb shortlist (${items.length}):\n\n${summaryText}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Wobb shortlist", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Shortlist copied to clipboard");
    } catch {
      toast.error("Couldn't share shortlist");
    }
  };

  const onClearAll = () => {
    if (!items.length) return;
    if (window.confirm(`Clear all ${items.length} creators from your shortlist?`)) {
      clear();
      toast("Shortlist cleared", { icon: "🧹" });
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to search
        </Link>

        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="brand">
                <Bookmark className="h-3 w-3" aria-hidden />
                Shortlist
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[rgb(var(--text))]">
              Your shortlisted creators
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              Drag to reorder, export as CSV or share with your team. Stored locally in your browser.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={onShare} leftIcon={<Share2 className="h-4 w-4" aria-hidden />}>
                Share
              </Button>
              <Button variant="secondary" onClick={onExport} leftIcon={<Download className="h-4 w-4" aria-hidden />}>
                Export CSV
              </Button>
              <Button variant="danger" onClick={onClearAll} leftIcon={<Trash2 className="h-4 w-4" aria-hidden />}>
                Clear
              </Button>
            </div>
          )}
        </header>

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<Bookmark className="h-6 w-6" aria-hidden />}
              title="Your shortlist is empty"
              description="Browse creators on the search page and use the bookmark button to add them here."
              action={
                <Link
                  to="/"
                  className="inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 text-sm font-medium text-white shadow-sm hover:brightness-110"
                >
                  Discover creators
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <section className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatCard label="Creators" value={String(summary.total)} icon={<Users className="h-4 w-4" aria-hidden />} />
              <StatCard label="Combined reach" value={formatCompact(summary.followers)} icon={<Users className="h-4 w-4" aria-hidden />} hint="Sum of followers" />
              <StatCard
                label="Avg. engagement"
                value={formatEngagementRate(summary.avgRate)}
                icon={<Bookmark className="h-4 w-4" aria-hidden />}
                hint="Across shortlisted"
              />
            </section>

            <ul className="mt-6 space-y-2" role="list" aria-label="Shortlisted creators">
              {items.map((item, index) => (
                <li
                  key={item.user_id}
                  draggable
                  onDragStart={onDragStart(index)}
                  onDragOver={onDragOver(index)}
                  onDrop={onDrop(index)}
                  onDragEnd={onDragEnd}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-3 transition-all",
                    dragIndex === index && "opacity-40",
                    dragOverIndex === index && dragIndex !== index && "border-brand-500/40 ring-2 ring-brand-500/20"
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Reorder ${item.fullname || item.username}. Use arrow keys.`}
                    onKeyDown={onKeyReorder(index)}
                    className="inline-flex h-9 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-[rgb(var(--text-subtle))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--text))] active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4" aria-hidden />
                  </button>

                  <span className="w-6 shrink-0 text-center font-mono text-xs tabular-nums text-[rgb(var(--text-subtle))]">
                    {index + 1}
                  </span>

                  <Link
                    to={`/profile/${encodeURIComponent(item.username)}?platform=${item.platform}`}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 -m-1 hover:bg-[rgb(var(--surface-muted))]"
                  >
                    <Avatar src={item.picture} alt={item.fullname} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate font-semibold text-[rgb(var(--text))]">
                          {item.fullname || `@${item.username}`}
                        </span>
                        <VerifiedBadge verified={item.is_verified} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[rgb(var(--text-muted))]">
                        <span>@{item.username}</span>
                        <span aria-hidden>·</span>
                        <Badge tone={PLATFORM_TONE[item.platform]} className="rounded-md">
                          {getPlatformLabel(item.platform)}
                        </Badge>
                        <span className="hidden text-[rgb(var(--text-subtle))] sm:inline">
                          Added {formatRelativeTime(item.addedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="hidden shrink-0 items-center gap-6 sm:flex">
                    <StatCell label="Followers" value={formatCompact(item.followers)} />
                    <StatCell label="ER" value={formatEngagementRate(item.engagement_rate)} />
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open @${item.username} on ${getPlatformLabel(item.platform)}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--text-subtle))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--text))]"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        remove(item.user_id);
                        toast(`Removed @${item.username}`, { icon: "🗑️", id: `rm-${item.user_id}` });
                      }}
                      aria-label={`Remove @${item.username} from shortlist`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--text-subtle))] hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elev))] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[rgb(var(--text-subtle))]">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-[rgb(var(--text))]">{value}</div>
      {hint && <div className="text-xs text-[rgb(var(--text-subtle))]">{hint}</div>}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-wide text-[rgb(var(--text-subtle))]">{label}</div>
      <div className="text-sm font-semibold tabular-nums text-[rgb(var(--text))]">{value}</div>
    </div>
  );
}

// Kept for reference in exports; type used from module scope.
export type { ShortlistItem };
