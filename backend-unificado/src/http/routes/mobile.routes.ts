import { Router } from "express";
import { MobileController } from "../controllers/mobile.controller";

const router = Router();
const controller = new MobileController();

router.post("/mobile/receitas", (req, res) => controller.postReceitas(req, res));
router.get("/mobile/receitas/ultimo", (req, res) => controller.getUltimo(req, res));
router.get("/mobile/paciente/ultimo", (req, res) => controller.getUltimoPaciente(req, res));

export { router as mobileRoutes };
