import { Router, type IRouter } from "express";
import { GetGamingNewsResponse, GetGamingNewsQueryParams } from "@workspace/api-zod";
import { fetchNews } from "../lib/news";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const parsed = GetGamingNewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const items = await fetchNews(parsed.data.pageSize ?? 30);
    res.json(GetGamingNewsResponse.parse({ items }));
  } catch (err) {
    req.log.error({ err }, "news failed");
    res.status(502).json({ error: "News feeds unavailable" });
  }
});

export default router;
