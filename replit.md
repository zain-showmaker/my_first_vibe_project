# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Project: GameVerse

A full-scale gaming wiki web app powered by RAWG and live RSS feeds.

### Architecture

- **artifacts/gameverse** — React + Vite + Tailwind + Wouter frontend (path: `/`).
  Dark theme, lime accent (`#e8ff47`), Inter font. Dense, editorial layout.
- **artifacts/api-server** — Express + Pino API (path: `/api`).
  Proxies RAWG (`lib/rawg.ts`) with in-memory TTL caching (`lib/cache.ts`) and
  aggregates gaming news from RSS feeds via `lib/news.ts` (PC Gamer, Polygon,
  Eurogamer, Rock Paper Shotgun).
- **lib/api-spec** — OpenAPI source of truth at `openapi.yaml`.
- **lib/api-client-react** — generated React Query hooks consumed by the frontend.

### Frontend pages

- `/` — Home (trending hero, new releases, top rated, upcoming, news, genres, platforms)
- `/browse` — Searchable + filterable catalog with pagination (URL-driven state)
- `/news` — Live aggregated gaming headlines
- `/games/:slug` — Detail page with About / Screenshots / Specs / DLC / Series tabs
- `/watchlist` — localStorage-backed bookmarks (no account needed)
- `/about` — Project info + credits

### Conventions

- Hooks come from `@workspace/api-client-react`; never call `setBaseUrl` (the
  proxy already routes `/api/*` to the API server).
- For gated queries, pass both `enabled` and `queryKey` (use the generated
  `getXxxQueryKey` helpers).
- No emojis anywhere — Lucide icons only.
- Watchlist hook stores `WatchEntry` objects; legacy slug-only data is
  migrated transparently on first load.

### Secrets

- `RAWG_API_KEY` — required by the API server.
- `SESSION_SECRET` — reserved for future auth.
