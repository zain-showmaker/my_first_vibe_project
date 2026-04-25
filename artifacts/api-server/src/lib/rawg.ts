import { logger } from "./logger";
import { cached } from "./cache";

const BASE = "https://api.rawg.io/api";

function getKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    throw new Error("RAWG_API_KEY is not set");
  }
  return key;
}

export async function rawgFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  ttlMs = 5 * 60 * 1000,
): Promise<T> {
  const search = new URLSearchParams();
  search.set("key", getKey());
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  }
  const cacheKey = `${path}?${[...search.entries()]
    .filter(([k]) => k !== "key")
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("&")}`;

  return cached(cacheKey, ttlMs, async () => {
    const url = `${BASE}${path}?${search.toString()}`;
    const safeUrl = url.replace(/key=[^&]+/, "key=***");
    logger.debug({ url: safeUrl }, "RAWG fetch");
    const res = await fetch(url, {
      headers: { "User-Agent": "GameVerse/1.0 (+replit)" },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error(
        { status: res.status, url: safeUrl, body: body.slice(0, 300) },
        "RAWG request failed",
      );
      const err = new Error(`RAWG ${res.status}`);
      // @ts-expect-error attach status
      err.status = res.status;
      throw err;
    }
    return (await res.json()) as T;
  });
}

interface RawgNamed {
  id: number;
  name: string;
  slug: string;
  games_count?: number;
  image_background?: string | null;
}

interface RawgPlatformWrap {
  platform: RawgNamed;
}

interface RawgGameRaw {
  id: number;
  slug: string;
  name: string;
  released?: string | null;
  tba?: boolean;
  background_image?: string | null;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  metacritic?: number | null;
  playtime?: number | null;
  genres?: RawgNamed[];
  platforms?: RawgPlatformWrap[];
  parent_platforms?: RawgPlatformWrap[];
  short_screenshots?: { id: number; image: string }[];
  esrb_rating?: RawgNamed | null;
}

export interface GameSummary {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  backgroundImage: string | null;
  rating: number;
  ratingTop: number;
  ratingsCount: number;
  metacritic: number | null;
  playtime: number | null;
  genres: { id: number; name: string; slug: string }[];
  platforms: { platform: { id: number; name: string; slug: string } }[];
  parentPlatforms: { platform: { id: number; name: string; slug: string } }[];
  shortScreenshots?: { id: number; image: string }[];
  esrbRating: { id: number; name: string; slug: string } | null;
}

function namedRef(n: RawgNamed) {
  return { id: n.id, name: n.name, slug: n.slug };
}

export function mapGameSummary(g: RawgGameRaw): GameSummary {
  return {
    id: g.id,
    slug: g.slug,
    name: g.name,
    released: g.released ?? null,
    tba: g.tba ?? false,
    backgroundImage: g.background_image ?? null,
    rating: g.rating ?? 0,
    ratingTop: g.rating_top ?? 5,
    ratingsCount: g.ratings_count ?? 0,
    metacritic: g.metacritic ?? null,
    playtime: g.playtime ?? null,
    genres: (g.genres ?? []).map(namedRef),
    platforms: (g.platforms ?? []).map((p) => ({ platform: namedRef(p.platform) })),
    parentPlatforms: (g.parent_platforms ?? []).map((p) => ({
      platform: namedRef(p.platform),
    })),
    shortScreenshots: g.short_screenshots?.map((s) => ({ id: s.id, image: s.image })),
    esrbRating: g.esrb_rating ? namedRef(g.esrb_rating) : null,
  };
}

export interface GameListPayload {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameSummary[];
}

export async function fetchGameList(
  params: Record<string, string | number | undefined>,
  ttlMs?: number,
): Promise<GameListPayload> {
  const data = await rawgFetch<{
    count: number;
    next: string | null;
    previous: string | null;
    results: RawgGameRaw[];
  }>("/games", params, ttlMs);
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map(mapGameSummary),
  };
}

interface RawgGameDetailRaw extends RawgGameRaw {
  name_original?: string | null;
  description?: string;
  description_raw?: string;
  background_image_additional?: string | null;
  website?: string | null;
  metacritic_url?: string | null;
  reddit_url?: string | null;
  screenshots_count?: number;
  movies_count?: number;
  achievements_count?: number;
  additions_count?: number;
  game_series_count?: number;
  developers?: RawgNamed[];
  publishers?: RawgNamed[];
  tags?: RawgNamed[];
  stores?: { id: number; url?: string | null; store: RawgNamed }[];
  platforms?: (RawgPlatformWrap & {
    requirements?: { minimum?: string; recommended?: string };
  })[];
}

export interface GameDetail {
  id: number;
  slug: string;
  name: string;
  nameOriginal: string | null;
  description: string;
  descriptionRaw: string;
  released: string | null;
  tba: boolean;
  backgroundImage: string | null;
  backgroundImageAdditional: string | null;
  website: string | null;
  rating: number;
  ratingTop: number;
  ratingsCount: number;
  metacritic: number | null;
  metacriticUrl: string | null;
  redditUrl: string | null;
  playtime: number | null;
  screenshotsCount: number;
  moviesCount: number;
  achievementsCount: number;
  additionsCount: number;
  gameSeriesCount: number;
  developers: { id: number; name: string; slug: string }[];
  publishers: { id: number; name: string; slug: string }[];
  genres: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  platforms: { platform: { id: number; name: string; slug: string } }[];
  parentPlatforms: { platform: { id: number; name: string; slug: string } }[];
  stores: {
    id: number;
    url: string | null;
    store: { id: number; name: string; slug: string };
  }[];
  esrbRating: { id: number; name: string; slug: string } | null;
  systemRequirements: {
    platform: string;
    minimum: string | null;
    recommended: string | null;
  }[];
}

export async function fetchGameDetail(slug: string): Promise<GameDetail | null> {
  try {
    const g = await rawgFetch<RawgGameDetailRaw>(`/games/${encodeURIComponent(slug)}`, {}, 30 * 60 * 1000);
    return {
      id: g.id,
      slug: g.slug,
      name: g.name,
      nameOriginal: g.name_original ?? null,
      description: g.description ?? "",
      descriptionRaw: g.description_raw ?? "",
      released: g.released ?? null,
      tba: g.tba ?? false,
      backgroundImage: g.background_image ?? null,
      backgroundImageAdditional: g.background_image_additional ?? null,
      website: g.website ?? null,
      rating: g.rating ?? 0,
      ratingTop: g.rating_top ?? 5,
      ratingsCount: g.ratings_count ?? 0,
      metacritic: g.metacritic ?? null,
      metacriticUrl: g.metacritic_url ?? null,
      redditUrl: g.reddit_url ?? null,
      playtime: g.playtime ?? null,
      screenshotsCount: g.screenshots_count ?? 0,
      moviesCount: g.movies_count ?? 0,
      achievementsCount: g.achievements_count ?? 0,
      additionsCount: g.additions_count ?? 0,
      gameSeriesCount: g.game_series_count ?? 0,
      developers: (g.developers ?? []).map(namedRef),
      publishers: (g.publishers ?? []).map(namedRef),
      genres: (g.genres ?? []).map(namedRef),
      tags: (g.tags ?? []).map(namedRef),
      platforms: (g.platforms ?? []).map((p) => ({ platform: namedRef(p.platform) })),
      parentPlatforms: (g.parent_platforms ?? []).map((p) => ({
        platform: namedRef(p.platform),
      })),
      stores: (g.stores ?? []).map((s) => ({
        id: s.id,
        url: s.url ?? null,
        store: namedRef(s.store),
      })),
      esrbRating: g.esrb_rating ? namedRef(g.esrb_rating) : null,
      systemRequirements: (g.platforms ?? [])
        .filter((p) => p.requirements && (p.requirements.minimum || p.requirements.recommended))
        .map((p) => ({
          platform: p.platform.name,
          minimum: p.requirements?.minimum ?? null,
          recommended: p.requirements?.recommended ?? null,
        })),
    };
  } catch (err) {
    // @ts-expect-error status
    if (err?.status === 404) return null;
    throw err;
  }
}

export async function fetchScreenshots(slug: string) {
  const data = await rawgFetch<{
    count: number;
    results: { id: number; image: string; width?: number; height?: number }[];
  }>(`/games/${encodeURIComponent(slug)}/screenshots`, {}, 30 * 60 * 1000);
  return {
    count: data.count,
    results: data.results.map((r) => ({
      id: r.id,
      image: r.image,
      width: r.width ?? null,
      height: r.height ?? null,
    })),
  };
}

export async function fetchDlcs(slug: string) {
  const data = await rawgFetch<{
    count: number;
    results: RawgGameRaw[];
  }>(`/games/${encodeURIComponent(slug)}/additions`, { page_size: 20 }, 30 * 60 * 1000);
  return {
    count: data.count,
    results: data.results.map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      released: g.released ?? null,
      backgroundImage: g.background_image ?? null,
      rating: g.rating ?? 0,
      metacritic: g.metacritic ?? null,
    })),
  };
}

export async function fetchSeries(slug: string) {
  const data = await rawgFetch<{
    count: number;
    next: string | null;
    previous: string | null;
    results: RawgGameRaw[];
  }>(`/games/${encodeURIComponent(slug)}/game-series`, { page_size: 12 }, 30 * 60 * 1000);
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map(mapGameSummary),
  };
}

export async function fetchGenres() {
  const data = await rawgFetch<{ results: RawgNamed[] }>("/genres", { page_size: 40 }, 60 * 60 * 1000);
  return {
    results: data.results.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      gamesCount: g.games_count ?? 0,
      imageBackground: g.image_background ?? null,
    })),
  };
}

export async function fetchPlatforms() {
  const data = await rawgFetch<{ results: RawgNamed[] }>("/platforms/lists/parents", { page_size: 20 }, 60 * 60 * 1000);
  return {
    results: data.results.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      gamesCount: p.games_count ?? 0,
      imageBackground: p.image_background ?? null,
    })),
  };
}
