import { HorariosRepository } from "../repositories/horarios.repository";
import { MedicamentosRepository } from "../repositories/medicamentos.repository";
import { PacientesRepository } from "../repositories/pacientes.repository";

export class CatalogoService {
  constructor(
    private readonly pacientesRepo: PacientesRepository,
    private readonly medicamentosRepo: MedicamentosRepository,
    private readonly horariosRepo: HorariosRepository
  ) {}

  async resumoOperacional() {
    const [pacientes, medicamentos, horarios] = await Promise.all([
      this.pacientesRepo.listarAtivos(500),
      this.medicamentosRepo.listarAtivos(500),
      this.horariosRepo.listarProximos(1000),
    ]);

    return {
      total_pacientes: pacientes.length,
      total_medicamentos: medicamentos.length,
      total_horarios_proximos: horarios.length,
      pacientes,
      medicamentos,
      horarios,
    };
  }
}
