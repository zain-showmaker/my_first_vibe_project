import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import metaRouter from "./meta";
import newsRouter from "./news";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);
router.use(metaRouter);
router.use(newsRouter);

export default router;
