import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import categoriesRouter from "./categories";
import rolesRouter from "./roles";
import ratingsRouter from "./ratings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(categoriesRouter);
router.use(rolesRouter);
router.use(ratingsRouter);

export default router;
