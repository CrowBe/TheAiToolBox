import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import categoriesRouter from "./categories";
import rolesRouter from "./roles";
import ratingsRouter from "./ratings";
import toolboxRouter from "./toolbox";
import changelogRouter from "./changelog";
import commentsRouter from "./comments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(categoriesRouter);
router.use(rolesRouter);
router.use(ratingsRouter);
router.use(toolboxRouter);
router.use(changelogRouter);
router.use(commentsRouter);

export default router;
