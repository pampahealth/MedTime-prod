import { Router } from "express";
import { MedtimeCrudService } from "../../application/services/medtime-crud.service";
import { MedtimeController } from "../controllers/medtime.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new MedtimeController(new MedtimeCrudService());

router.use(authMiddleware);

router.get("/:resource", (req, res, next) => controller.list(req, res).catch(next));
router.get("/:resource/:id", (req, res, next) => controller.getById(req, res).catch(next));
router.post("/:resource", (req, res, next) => controller.create(req, res).catch(next));
router.put("/:resource/:id", (req, res, next) => controller.update(req, res).catch(next));
router.delete("/:resource/:id", (req, res, next) => controller.remove(req, res).catch(next));

export { router as medtimeRoutes };
