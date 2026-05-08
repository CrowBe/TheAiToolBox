import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import toolsRouter from "./tools.js";
import categoriesRouter from "./categories.js";
import rolesRouter from "./roles.js";
import ratingsRouter from "./ratings.js";
import toolboxRouter from "./toolbox.js";
import changelogRouter from "./changelog.js";
import commentsRouter from "./comments.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(categoriesRouter);
router.use(rolesRouter);
router.use(ratingsRouter);
router.use(toolboxRouter);
router.use(changelogRouter);
router.use(commentsRouter);
router.use(adminRouter);

export default router;
