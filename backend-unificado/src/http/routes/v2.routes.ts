import { Router } from "express";
import { CatalogoService } from "../../application/services/catalogo.service";
import { HorariosRepository } from "../../application/repositories/horarios.repository";
import { MedicamentosRepository } from "../../application/repositories/medicamentos.repository";
import { PacientesRepository } from "../../application/repositories/pacientes.repository";
import { V2Controller } from "../controllers/v2.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new V2Controller(
  new CatalogoService(new PacientesRepository(), new MedicamentosRepository(), new HorariosRepository())
);

router.use(authMiddleware);
router.get("/resumo-operacional", (req, res, next) => controller.resumo(req, res).catch(next));

export { router as v2Routes };
