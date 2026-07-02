import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Platform, ShortlistItem, UserProfileSummary } from "@/types";

interface ShortlistState {
  items: ShortlistItem[];
  add: (profile: UserProfileSummary, platform: Platform) => { added: boolean };
  remove: (user_id: string) => void;
  toggle: (profile: UserProfileSummary, platform: Platform) => { added: boolean };
  clear: () => void;
  reorder: (from: number, to: number) => void;
  setItems: (items: ShortlistItem[]) => void;
  setNote: (user_id: string, note: string) => void;
  has: (user_id: string) => boolean;
}

const STORAGE_KEY = "wobb-shortlist";
const STORAGE_VERSION = 1;

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      items: [],

      has: (user_id) => get().items.some((item) => item.user_id === user_id),

      add: (profile, platform) => {
        const state = get();
        if (state.items.some((item) => item.user_id === profile.user_id)) {
          return { added: false };
        }
        const entry: ShortlistItem = {
          user_id: profile.user_id,
          username: profile.username,
          fullname: profile.fullname,
          picture: profile.picture,
          platform,
          is_verified: profile.is_verified,
          followers: profile.followers,
          engagement_rate: profile.engagement_rate,
          url: profile.url,
          addedAt: Date.now(),
        };
        set({ items: [entry, ...state.items] });
        return { added: true };
      },

      remove: (user_id) => {
        set({ items: get().items.filter((item) => item.user_id !== user_id) });
      },

      toggle: (profile, platform) => {
        if (get().has(profile.user_id)) {
          get().remove(profile.user_id);
          return { added: false };
        }
        return get().add(profile, platform);
      },

      clear: () => set({ items: [] }),

      reorder: (from, to) => {
        const items = [...get().items];
        if (from < 0 || from >= items.length || to < 0 || to >= items.length) return;
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        set({ items });
      },

      setItems: (items) => set({ items }),

      setNote: (user_id, note) => {
        set({
          items: get().items.map((item) =>
            item.user_id === user_id ? { ...item, note } : item
          ),
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Stable selector — returns count without causing a re-render on unrelated changes. */
export const useShortlistCount = () => useShortlistStore((s) => s.items.length);
