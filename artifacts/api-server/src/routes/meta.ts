import { Router, type IRouter } from "express";
import { ListGenresResponse, ListPlatformsResponse } from "@workspace/api-zod";
import { fetchGenres, fetchPlatforms } from "../lib/rawg";

const router: IRouter = Router();

router.get("/genres", async (req, res): Promise<void> => {
  try {
    const data = await fetchGenres();
    res.json(ListGenresResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "genres failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

router.get("/platforms", async (req, res): Promise<void> => {
  try {
    const data = await fetchPlatforms();
    res.json(ListPlatformsResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "platforms failed");
    res.status(502).json({ error: "Upstream RAWG error" });
  }
});

export default router;
