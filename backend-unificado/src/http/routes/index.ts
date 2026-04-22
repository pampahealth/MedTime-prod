import { Router } from "express";
import { medtimeRoutes } from "./medtime.routes";
import { mobileRoutes } from "./mobile.routes";
import { receitasRoutes } from "./receitas.routes";
import { sessionsRoutes } from "./sessions.routes";
import { v2Routes } from "./v2.routes";

const router = Router();

router.use(sessionsRoutes);
router.use("/api", receitasRoutes);
router.use("/api", mobileRoutes);
router.use("/api/v2", v2Routes);
router.use("/medtime", medtimeRoutes);

export { router as appRoutes };
