import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, SortKey, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  return getSearchData(platform).accounts.map((item) => item.account.user_profile);
}

/** Look up a creator across every platform's search data. Case-insensitive
 *  and defensive against malformed entries in the seed JSON. */
export function findProfileInSearch(
  username: string
): { profile: UserProfileSummary; platform: Platform } | null {
  if (!username) return null;
  const needle = username.toLowerCase();
  for (const platform of ["instagram", "youtube", "tiktok"] as Platform[]) {
    const profile = extractProfiles(platform).find(
      (p) => p && typeof p.username === "string" && p.username.toLowerCase() === needle
    );
    if (profile) return { profile, platform };
  }
  return null;
}

export interface FilterOptions {
  query?: string;
  verifiedOnly?: boolean;
  minFollowers?: number;
}

/** Case-insensitive multi-field filter, tolerant of extra whitespace. */
export function filterProfiles(
  profiles: UserProfileSummary[],
  opts: FilterOptions
): UserProfileSummary[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  const minFollowers = opts.minFollowers ?? 0;
  const verifiedOnly = opts.verifiedOnly ?? false;

  return profiles.filter((p) => {
    if (verifiedOnly && !p.is_verified) return false;
    if (p.followers < minFollowers) return false;
    if (!q) return true;
    return (
      p.username.toLowerCase().includes(q) ||
      p.fullname.toLowerCase().includes(q)
    );
  });
}

export function sortProfiles(
  profiles: UserProfileSummary[],
  sortKey: SortKey
): UserProfileSummary[] {
  if (sortKey === "relevance") return profiles;
  const copy = [...profiles];
  switch (sortKey) {
    case "followers-desc":
      return copy.sort((a, b) => b.followers - a.followers);
    case "followers-asc":
      return copy.sort((a, b) => a.followers - b.followers);
    case "engagement-desc":
      return copy.sort((a, b) => (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0));
    case "name-asc":
      return copy.sort((a, b) => a.fullname.localeCompare(b.fullname));
  }
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok",
  };
  return labels[platform];
}

export function getPlatformAccent(platform: Platform): string {
  const accents: Record<Platform, string> = {
    instagram: "from-fuchsia-500 via-pink-500 to-amber-400",
    youtube: "from-red-500 via-rose-500 to-orange-400",
    tiktok: "from-teal-400 via-cyan-500 to-fuchsia-500",
  };
  return accents[platform];
}
