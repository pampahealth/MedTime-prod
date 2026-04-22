import { Router } from "express";
import { ReceitasRepository } from "../../application/repositories/receitas.repository";
import { ReceitasService } from "../../application/services/receitas.service";
import { ReceitasController } from "../controllers/receitas.controller";

const router = Router();
const controller = new ReceitasController(new ReceitasService(new ReceitasRepository()));

router.get("/receitas/por-data", (req, res, next) => controller.porData(req, res).catch(next));
router.get("/receitas/por-paciente", (req, res, next) => controller.porNomePaciente(req, res).catch(next));
router.get("/receitas/por-cartao-sus", (req, res, next) => controller.porCartaoSus(req, res).catch(next));
router.get("/coleta/completa", (req, res, next) => controller.coletaCompleta(req, res).catch(next));

export { router as receitasRoutes };
