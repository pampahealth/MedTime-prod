import { Router } from "express";
import { SessionService } from "../../application/services/session.service";
import { SessionsController } from "../controllers/sessions.controller";

const router = Router();
const controller = new SessionsController(new SessionService());

router.post("/sessions", (req, res, next) => controller.login(req, res).catch(next));

export { router as sessionsRoutes };
