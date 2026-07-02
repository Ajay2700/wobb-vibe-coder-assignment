export type Platform = "instagram" | "youtube" | "tiktok";

export const PLATFORMS: readonly Platform[] = ["instagram", "youtube", "tiktok"] as const;

export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
  account_type?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source?: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_shares?: number;
  avg_saves?: number;
  avg_reels_plays?: number;
  total_likes?: number;
  gender?: string;
  age_group?: string;
  language?: { code: string; name: string };
  stat_history?: Array<{
    month: string;
    followers?: number;
    following?: number;
    avg_likes?: number;
    avg_comments?: number;
    avg_views?: number;
    avg_shares?: number;
    avg_saves?: number;
    total_likes?: number;
  }>;
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

/** An entry stored in the persistent shortlist. */
export interface ShortlistItem {
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  platform: Platform;
  is_verified: boolean;
  followers: number;
  engagement_rate?: number;
  url: string;
  addedAt: number;
  note?: string;
}

export type SortKey = "relevance" | "followers-desc" | "followers-asc" | "engagement-desc" | "name-asc";

export type ThemeMode = "light" | "dark" | "system";
