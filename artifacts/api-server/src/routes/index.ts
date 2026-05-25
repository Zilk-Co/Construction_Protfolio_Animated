import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import projectsRouter from "./projects";
import imagesRouter from "./images";
import machineryRouter from "./machinery";
import adminRouter from "./admin";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(projectsRouter);
router.use(imagesRouter);
router.use(machineryRouter);
router.use(adminRouter);
router.use(settingsRouter);

export default router;
