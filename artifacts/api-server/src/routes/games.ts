import { Router, type IRouter } from "express";
import {
  ListGamesQueryParams,
  ListGamesResponse,
  GetTrendingGamesQueryParams,
  GetTrendingGamesResponse,
  GetNewReleasesQueryParams,
  GetNewReleasesResponse,
  GetTopRatedGamesQueryParams,
  GetTopRatedGamesResponse,
  GetUpcomingGamesQueryParams,
  GetUpcomingGamesResponse,
  GetGameDetailParams,
  GetGameDetailResponse,
  GetGameScreenshotsParams,
  GetGameScreenshotsResponse,
  GetGameDlcsParams,
  GetGameDlcsResponse,
  GetGameSeriesParams,
  GetGameSeriesResponse,
} from "@workspace/api-zod";
import {
  fetchGameList,
  fetchGameDetail,
  fetchScreenshots,
  fetchDlcs,
  fetchSeries,
} from "../lib/rawg";

const router: IRouter = Router();

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

router.get("/games", async (req, res): Promise<void> => {
  const parsed = ListGamesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, genres, platforms, dates, ordering, page, pageSize } = parsed.data;
  try {
    const data = await fetchGameList(
      {
        search,
        genres,
        parent_platforms: platforms,
        dates,
        ordering: ordering ?? (search ? undefined : "-added"),
        page,
        page_size: pageSize ?? 20,
        search_precise: search ? "true" : undefined,
      },
      search ? 5 * 60 * 1000 : 30 * 60 * 1000,
    );
    res.json(ListGamesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "listGames failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/trending", async (req, res): Promise<void> => {
  const parsed = GetTrendingGamesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const data = await fetchGameList(
      {
        dates: `${todayISO(-90)},${todayISO(0)}`,
        ordering: "-added",
        page_size: parsed.data.pageSize ?? 12,
      },
      30 * 60 * 1000,
    );
    res.json(GetTrendingGamesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "trending failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/new-releases", async (req, res): Promise<void> => {
  const parsed = GetNewReleasesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const data = await fetchGameList(
      {
        dates: `${todayISO(-60)},${todayISO(0)}`,
        ordering: "-released",
        page_size: parsed.data.pageSize ?? 12,
      },
      30 * 60 * 1000,
    );
    res.json(GetNewReleasesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "new-releases failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/top-rated", async (req, res): Promise<void> => {
  const parsed = GetTopRatedGamesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const year = new Date().getUTCFullYear();
    const data = await fetchGameList(
      {
        dates: `${year}-01-01,${year}-12-31`,
        ordering: "-metacritic",
        page_size: parsed.data.pageSize ?? 12,
      },
      60 * 60 * 1000,
    );
    res.json(GetTopRatedGamesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "top-rated failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/upcoming", async (req, res): Promise<void> => {
  const parsed = GetUpcomingGamesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const data = await fetchGameList(
      {
        dates: `${todayISO(1)},${todayISO(365)}`,
        ordering: "released",
        page_size: parsed.data.pageSize ?? 12,
      },
      60 * 60 * 1000,
    );
    res.json(GetUpcomingGamesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "upcoming failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/:slug", async (req, res): Promise<void> => {
  const params = GetGameDetailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const detail = await fetchGameDetail(params.data.slug);
    if (!detail) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.json(GetGameDetailResponse.parse(detail));
  } catch (err) {
    req.log.error({ err }, "game detail failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/:slug/screenshots", async (req, res): Promise<void> => {
  const params = GetGameScreenshotsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const data = await fetchScreenshots(params.data.slug);
    res.json(GetGameScreenshotsResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "screenshots failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/:slug/dlcs", async (req, res): Promise<void> => {
  const params = GetGameDlcsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const data = await fetchDlcs(params.data.slug);
    res.json(GetGameDlcsResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "dlcs failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/games/:slug/series", async (req, res): Promise<void> => {
  const params = GetGameSeriesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const data = await fetchSeries(params.data.slug);
    res.json(GetGameSeriesResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "series failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

export default router;
