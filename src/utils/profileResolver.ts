import type { FullUserProfile, Platform, UserProfileSummary } from "@/types";
import { findProfileInSearch } from "@/utils/dataHelpers";
import { loadProfileByUsername } from "@/utils/profileLoader";

export interface ResolvedProfile {
  user: FullUserProfile;
  platform: Platform;
}

/** Build a 12-month follower trend from the current count for search-only profiles. */
function buildEstimatedStatHistory(
  followers: number
): NonNullable<FullUserProfile["stat_history"]> {
  const points: NonNullable<FullUserProfile["stat_history"]> = [];
  const now = new Date();
  const monthlyGrowth = 0.012;

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const factor = Math.pow(1 + monthlyGrowth, 11 - i);
    points.push({ month, followers: Math.round(followers / factor) });
  }

  return points;
}

/** Expand search-index fields into a detail-page profile shape. */
export function enrichProfileFromSearch(
  profile: UserProfileSummary,
  platform: Platform
): FullUserProfile {
  const enriched: FullUserProfile = { ...profile };

  if (enriched.engagements !== undefined) {
    if (enriched.avg_likes === undefined) {
      enriched.avg_likes = enriched.engagements;
    }
    if (platform === "youtube" || platform === "tiktok") {
      if (enriched.avg_comments === undefined) {
        enriched.avg_comments = Math.max(
          1,
          Math.round(enriched.engagements * 0.08)
        );
      }
    }
  }

  if (platform === "instagram" && enriched.avg_comments === undefined && enriched.engagements) {
    enriched.avg_comments = Math.max(
      1,
      Math.round(enriched.engagements * 0.05)
    );
  }

  if (!enriched.stat_history?.length && enriched.followers > 0) {
    enriched.stat_history = buildEstimatedStatHistory(enriched.followers);
  }

  return enriched;
}

function normalizeUsername(username: string): string {
  try {
    return decodeURIComponent(username).trim();
  } catch {
    return username.trim();
  }
}

/** Load full JSON when available; otherwise enrich the search-index entry. */
export async function resolveProfile(
  username: string,
  hintedPlatform: Platform
): Promise<ResolvedProfile | null> {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const full = await loadProfileByUsername(normalized);
  if (full?.data.user_profile) {
    return {
      user: full.data.user_profile,
      platform: hintedPlatform,
    };
  }

  const summary = findProfileInSearch(normalized, hintedPlatform);
  if (!summary) return null;

  return {
    user: enrichProfileFromSearch(summary.profile, summary.platform),
    platform: summary.platform,
  };
}
