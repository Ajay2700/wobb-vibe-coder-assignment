# Wobb — Creator Discovery

A production-grade influencer discovery app: search, filter, sort and build a
persistent shortlist across Instagram, YouTube and TikTok. Built for the Wobb
Vibe Coder Intern take-home.

**Live demo →** https://wobb-vibe-coder-assignment-bice.vercel.app
**Repository →** https://github.com/Ajay2700/wobb-vibe-coder-assignment

> **Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Zustand (with
> `persist`) · React Router 7 · Lucide · react-hot-toast

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run lint      # ESLint (0 warnings, 0 errors)
npm run typecheck # tsc --noEmit
```

## What was delivered

The starter shipped as a rough single-file layout with intentional bugs and a
disabled "Add to List" stub. The submission below re-architects it into a
polished, accessible, offline-friendly product.

### 1 · Bugs & quality issues fixed

| # | Location | Before | After |
|---|---|---|---|
| 1 | `ProfileDetailPage` | `engagement_rate * 10000` → `685.90%` | `formatEngagementRate` → `6.86%` |
| 2 | `ProfileDetailPage` | "Engagements" tile rendered the *rate* formatter over the *rate* value | Now renders raw engagement count via `formatCompact` |
| 3 | `dataHelpers.filterProfiles` | Case-sensitive on `username`, mixed with case-insensitive `fullname` | Uniform case-insensitive, trims whitespace |
| 4 | `ProfileCard` | Fixed `w-[700px]`, whole card was `<div onClick>` with no keyboard access, `<img>` had no `alt`, `data-search` debug attr | Semantic `<article>` + `<Link>`, responsive grid, graceful avatar fallback, proper alt text |
| 5 | `ProfileDetailPage` | `target="_blank"` without `rel="noopener noreferrer"` | Fixed (tabnabbing prevention) |
| 6 | `SearchPage` | Stale-closure `clickCount` with `console.log` side effect | Removed dead state |
| 7 | `profileLoader` | Case-sensitive filename lookup; unhandled promise rejection | Case-insensitive index + `try/catch` fallback |
| 8 | `App` | No 404 route, no error boundary, `loaded: boolean` instead of a state machine | Added `NotFoundPage`, `ErrorBoundary`, `Status = "loading" \| "ready" \| "error"` |
| 9 | `types` | `account_type`, `stat_history`, `avg_shares/saves`, `language` missing | Type surface widened to match the JSON payloads |
| 10 | Duplicate TODO comments, dead components (`SearchBar`, `PlatformFilter`, old `Layout`), `react-beautiful-dnd` peer-conflict with React 19 | All removed |

### 2 · Complete UI/UX redesign

- **Design tokens** live as CSS variables (`--surface`, `--text`, `--accent`…)
  driven by a `.dark` class — no `dark:` variants scattered through JSX where
  a token can carry the semantics. Set once in `src/index.css`.
- **Sticky header** with logo, primary nav, live shortlist counter badge (pops
  on add), and a 3-mode theme toggle (light / dark / system).
- **Sticky filter bar** with platform tabs, `⌘K`-focusable search, sort
  select and follower/verified filters — all mirrored into the URL so the
  page is deep-linkable and Back/Forward do the right thing.
- **Card grid** replaces the fixed-width list. Responsive 1 → 2 → 3 → 4 col.
- **Profile detail** gets a hero gradient, badge row, 4–8 KPI tiles picked
  from what the JSON actually contains, and a **12-month follower trend**
  rendered as an inline SVG sparkline (no chart library).
- **Empty states, skeletons, toasts** replace bare `Loading…` text.
- **Motion is subtle** and respects `prefers-reduced-motion`.

### 3 · Zustand for state management

The assignment specifies replacing React Context with Zustand — there was no
Context in the starter, so the migration is really a "greenfield Zustand"
decision on two stores:

- `store/shortlistStore.ts` — `items`, `add`, `remove`, `toggle`, `clear`,
  `reorder`, `setNote`, `has`. Wrapped in `persist({ name: "wobb-shortlist",
  version: 1, storage: createJSONStorage(() => localStorage) })`. `partialize`
  only stores the array; ephemeral UI state stays in memory. A stable
  `useShortlistCount` selector keeps the header badge from re-rendering on
  unrelated writes.
- `store/themeStore.ts` — persisted `mode: "light" | "dark" | "system"`. Bound
  to `<html class="dark">` via a `useThemeEffect()` hook that also listens to
  `matchMedia` when in system mode. An inline pre-paint script in `index.html`
  applies the class *before* React mounts, avoiding a flash of the wrong theme.

### 4 · Add to List / Shortlist feature

- **`AddToListButton`** is a single component with `compact` (icon-only on
  cards) and `full` (labelled on the detail page) variants. Reads only the
  membership boolean via a selector (`items.some(...)`) so cards only
  re-render when *their* item is toggled.
- **Duplicates are handled explicitly** — `add` returns `{ added: boolean }`
  and the toast reflects it. `toggle` flips membership in one call.
- **`/shortlist`** page: summary tiles (creators, combined reach, avg. ER),
  drag-to-reorder (native HTML5 DnD — no `react-beautiful-dnd` peer conflict),
  **keyboard** reorder via `↑`/`↓` on the drag handle, per-item remove, clear
  all with confirm, deep link to the platform profile.
- **Export CSV** — RFC 4180 compliant escaping, UTF-8 BOM for Excel.
- **Share** — uses the Web Share API when available, falls back to
  clipboard-copy with a toast.

### 5 · Performance

- Route-level code splitting via `React.lazy` + `<Suspense fallback={<RouteFallback />}>`.
- `useMemo` around `extractProfiles(platform)`, filtered result, and sorted
  result. Platform totals are computed **once** at module load, not per render.
- `useDeferredValue` on the search query so keystroke latency stays snappy
  under long lists.
- `React.memo` on `ProfileCard` and `AddToListButton`.
- Native `loading="lazy"`, `decoding="async"` on `<img>`, with an initials
  fallback that avoids a broken-image flash on remote CDN failures.
- Vite splits the six per-username profile JSONs into their own chunks — a
  detail page only downloads its own payload.

### 6 · Accessibility & polish

- Semantic landmarks: `<header>`, `<main id="main">`, `<footer>`, skip link.
- Proper `role="tablist"`, `role="tabpanel"`, `role="radiogroup"` on filters.
- `aria-pressed` on the shortlist toggle, `aria-label` on every icon button.
- Focus rings via `focus-visible` — visible for keyboard users, invisible for
  mouse.
- `⌘K` / `Ctrl+K` focuses the search box; `Esc` clears it.
- `prefers-reduced-motion` disables the shimmer / pop animations.
- Every user-facing action (add, remove, export, share, clear) confirms via a
  toast — silent state changes are hostile.

---

## Project structure

```
src/
├── App.tsx                 # Router + Suspense + ErrorBoundary + Toaster
├── main.tsx
├── index.css               # Design tokens, Tailwind theme, keyframes
├── types/                  # All shared TypeScript types
├── store/
│   ├── shortlistStore.ts   # Zustand + persist middleware
│   └── themeStore.ts       # Zustand + persist + matchMedia binding
├── hooks/
│   └── useDebouncedValue.ts
├── utils/
│   ├── cn.ts               # Zero-dep classnames merger
│   ├── formatters.ts       # formatCompact, formatEngagementRate, formatRelativeTime
│   ├── dataHelpers.ts      # extract, filter, sort, platform labels
│   ├── profileLoader.ts    # Case-insensitive glob-indexed profile JSON loader
│   └── csv.ts              # RFC 4180 CSV builder + downloader
├── components/
│   ├── layout/{Layout,Header}.tsx
│   ├── ui/{Button,Badge,Avatar,Skeleton,EmptyState}.tsx
│   ├── {ProfileCard,ProfileList,PlatformTabs,SearchInput,
│   │    SortSelect,FilterPanel,AddToListButton,ThemeToggle,
│   │    VerifiedBadge,ErrorBoundary,RouteFallback}.tsx
└── pages/
    ├── SearchPage.tsx          # URL-synced query, sort, filters
    ├── ProfileDetailPage.tsx   # Hero, KPI grid, follower sparkline
    ├── ShortlistPage.tsx       # DnD reorder, CSV, share, clear
    └── NotFoundPage.tsx
```

## Engineering decisions & trade-offs

- **Native HTML5 drag-and-drop instead of `react-beautiful-dnd`.** The
  starter's dependency conflicts with React 19 peer requirements. Rather than
  down-pin React or add a new library, I used the built-in `draggable` +
  `onDragStart/Over/Drop` API, added keyboard reorder via `↑`/`↓` on the drag
  handle, and gained ~30 KB of bundle savings.
- **Zero-dep `cn.ts` instead of always reaching for `clsx`/`tailwind-merge`.**
  The codebase's class strings don't have conflict-merge needs; the tiny
  helper does what's actually used.
- **URL as the source of truth for search/sort/filter state**, not local
  state or the Zustand store. It keeps deep links, browser Back/Forward and
  reloads coherent — which is how a discovery product actually gets shared
  ("send me the tiktok list of 1M+ verified creators").
- **CSV BOM prefix.** Excel misinterprets UTF-8 without a BOM and mangles
  non-ASCII usernames (Beyoncé, Cristiano). One `﻿` avoids a support
  ticket.
- **Follower sparkline as inline SVG.** For 12 points, a full charting
  library is overkill.
- **StrictMode kept on**, effect cleanup uses `let cancelled = false` to
  handle the double-invoke behaviour cleanly.
- **No test suite in this cut.** With a hard deadline and a design-heavy
  brief, I prioritised feature depth and polish. If continued, I'd add
  React Testing Library for the shortlist reducer, format helpers, and a
  Playwright smoke test for the add → shortlist → CSV flow.

## Deploy

- **Vercel** — `vercel.json` already includes the SPA rewrite and long-cache
  header for `/assets/*`. Framework auto-detects as Vite.
- **Netlify** — `netlify.toml` is included too.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then Vite production build |
| `npm run lint` | ESLint over the whole tree |
| `npm run typecheck` | Type-check without emitting |
| `npm run preview` | Serve the production build locally |

---

Built by Ajay for Wobb · July 2026.
