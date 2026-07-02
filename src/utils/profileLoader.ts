import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<{ default: ProfileDetailResponse } | ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

const indexByKey: Record<string, () => Promise<unknown>> = (() => {
  const map: Record<string, () => Promise<unknown>> = {};
  for (const [path, loader] of Object.entries(profileModules)) {
    const match = path.match(/\/([^/]+)\.json$/);
    if (match) map[match[1].toLowerCase()] = loader;
  }
  return map;
})();

/** Case-insensitive profile lookup with defensive error handling. */
export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const loader = indexByKey[username.toLowerCase()];
  if (!loader) return null;
  try {
    const mod = await loader();
    const data = (mod as { default?: ProfileDetailResponse }).default ?? (mod as ProfileDetailResponse);
    return data ?? null;
  } catch (err) {
    console.error("Failed to load profile", username, err);
    return null;
  }
}
