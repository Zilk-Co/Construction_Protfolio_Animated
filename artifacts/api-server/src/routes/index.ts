import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import projectsRouter from "./projects";
import imagesRouter from "./images";
import machineryRouter from "./machinery";
import servicesRouter from "./services";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import pageContentRouter from "./page_content";
import aiRouter from "./ai";
import documentsRouter from "./documents";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(projectsRouter);
router.use(imagesRouter);
router.use(machineryRouter);
router.use(servicesRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(pageContentRouter);
router.use(aiRouter);
router.use(documentsRouter);

export default router;
