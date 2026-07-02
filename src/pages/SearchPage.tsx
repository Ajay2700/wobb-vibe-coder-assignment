import { useCallback, useDeferredValue, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Platform, SortKey } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformTabs } from "@/components/PlatformTabs";
import { SearchInput } from "@/components/SearchInput";
import { SortSelect } from "@/components/SortSelect";
import { FilterPanel } from "@/components/FilterPanel";
import { ProfileList } from "@/components/ProfileList";
import { Badge } from "@/components/ui/Badge";
import { extractProfiles, filterProfiles, sortProfiles } from "@/utils/dataHelpers";
import { formatCompact } from "@/utils/formatters";
import { fadeUp, fadeUpStagger } from "@/lib/motionPresets";

function isPlatform(v: string | null): v is Platform {
  return v === "instagram" || v === "youtube" || v === "tiktok";
}

function isSortKey(v: string | null): v is SortKey {
  return (
    v === "relevance" ||
    v === "followers-desc" ||
    v === "followers-asc" ||
    v === "engagement-desc" ||
    v === "name-asc"
  );
}

const DEFAULTS = {
  platform: "instagram" as Platform,
  q: "",
  sort: "followers-desc" as SortKey,
  verified: false,
  min: 0,
};

/** Aggregate stats computed once at module load — never recomputed per render. */
const totalByPlatform: Record<Platform, number> = {
  instagram: extractProfiles("instagram").length,
  youtube: extractProfiles("youtube").length,
  tiktok: extractProfiles("tiktok").length,
};

const AGGREGATE = (() => {
  const all = [
    ...extractProfiles("instagram"),
    ...extractProfiles("youtube"),
    ...extractProfiles("tiktok"),
  ];
  const verified = all.filter((p) => p.is_verified).length;
  const totalReach = all.reduce((sum, p) => sum + (p.followers || 0), 0);
  return { total: all.length, verified, totalReach };
})();

export function SearchPage() {
  const [params, setParams] = useSearchParams();

  const platform: Platform = isPlatform(params.get("platform"))
    ? (params.get("platform") as Platform)
    : DEFAULTS.platform;
  const q = params.get("q") ?? DEFAULTS.q;
  const sort: SortKey = isSortKey(params.get("sort"))
    ? (params.get("sort") as SortKey)
    : DEFAULTS.sort;
  const verifiedOnly = params.get("verified") === "1";
  const minFollowers = Number(params.get("min") ?? "0") || 0;

  const update = useCallback(
    (patch: Record<string, string | number | boolean | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === null || v === "" || v === false || v === 0) next.delete(k);
            else next.set(k, String(v === true ? "1" : v));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  // Focus the query for interactive perf — defer expensive recompute vs input latency.
  const deferredQuery = useDeferredValue(q);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filtered = useMemo(
    () =>
      filterProfiles(allProfiles, {
        query: deferredQuery,
        verifiedOnly,
        minFollowers,
      }),
    [allProfiles, deferredQuery, verifiedOnly, minFollowers]
  );

  const sorted = useMemo(() => sortProfiles(filtered, sort), [filtered, sort]);

  useEffect(() => {
    document.title = `Discover ${platform} creators · Wobb`;
  }, [platform]);

  const clearFilters = () =>
    update({ q: null, verified: null, min: null, sort: null });

  const activeFiltersCount =
    (q ? 1 : 0) + (verifiedOnly ? 1 : 0) + (minFollowers > 0 ? 1 : 0);

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 0%, rgb(var(--accent) / 0.18) 0%, transparent 60%), radial-gradient(50% 50% at 80% 0%, rgb(var(--accent) / 0.10) 0%, transparent 60%)",
          }}
        />
        <motion.div
          className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-8"
          variants={fadeUpStagger}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-start gap-4">
            <motion.div variants={fadeUp}>
              <Badge tone="brand" className="rounded-full">
                <Sparkles className="h-3 w-3" aria-hidden />
                Creator discovery
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-3xl font-bold tracking-tight text-[rgb(var(--text))] sm:text-4xl lg:text-5xl"
            >
              Find the perfect creators for your next{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                campaign
              </span>
              .
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-sm text-[rgb(var(--text-muted))] sm:text-base"
            >
              Browse top influencers across Instagram, YouTube and TikTok. Filter, sort
              and build a shortlist you can revisit and export.
            </motion.p>
            <motion.dl
              variants={fadeUp}
              className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-xs"
            >
              <div>
                <dt className="uppercase tracking-wider text-[rgb(var(--text-subtle))]">Creators</dt>
                <dd className="text-lg font-semibold tabular-nums text-[rgb(var(--text))]">
                  {AGGREGATE.total}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider text-[rgb(var(--text-subtle))]">Verified</dt>
                <dd className="text-lg font-semibold tabular-nums text-[rgb(var(--text))]">
                  {AGGREGATE.verified}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider text-[rgb(var(--text-subtle))]">Combined reach</dt>
                <dd className="text-lg font-semibold tabular-nums text-[rgb(var(--text))]">
                  {formatCompact(AGGREGATE.totalReach)}
                </dd>
              </div>
            </motion.dl>
          </div>
        </motion.div>
      </section>

      <section
        className="sticky top-16 z-20 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]/85 backdrop-blur"
        aria-label="Filters"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <PlatformTabs
              selected={platform}
              onChange={(p) => update({ platform: p === DEFAULTS.platform ? null : p, q: null })}
              counts={totalByPlatform}
            />
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <SearchInput value={q} onChange={(v) => update({ q: v })} />
              <SortSelect
                value={sort}
                onChange={(v) => update({ sort: v === DEFAULTS.sort ? null : v })}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterPanel
              verifiedOnly={verifiedOnly}
              onVerifiedChange={(v) => update({ verified: v ? "1" : null })}
              minFollowers={minFollowers}
              onMinFollowersChange={(v) => update({ min: v || null })}
            />
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-300"
              >
                Reset filters ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </section>

      <section
        id={`panel-${platform}`}
        role="tabpanel"
        aria-labelledby={`tab-${platform}`}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Showing{" "}
            <span className="font-semibold tabular-nums text-[rgb(var(--text))]">
              {sorted.length}
            </span>{" "}
            of{" "}
            <span className="tabular-nums">{allProfiles.length}</span>{" "}
            {platform} creators
          </p>
        </div>

        <ProfileList
          profiles={sorted}
          platform={platform}
          onClearFilters={clearFilters}
        />
      </section>
    </Layout>
  );
}

