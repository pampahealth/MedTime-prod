import { supabase, SUPABASE_SCHEMA } from "../../infra/db/supabase";
import { Paciente } from "../../domain/entities";

export class PacientesRepository {
  async listarAtivos(limit = 500): Promise<Paciente[]> {
    const safeLimit = Math.max(1, Math.min(2000, limit));
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from("a004_pacientes")
      .select("a004_id_paciente,a004_cartao_sus,a004_nome,a004_celular,a004_data_nascimento")
      .eq("a004_ativo", true)
      .order("a004_nome", { ascending: true })
      .limit(safeLimit);
    if (error) throw new Error(`Erro ao listar pacientes: ${error.message}`);
    return (data ?? []).map((p) => ({
      id: String(p.a004_id_paciente),
      cartao_sus: String(p.a004_cartao_sus ?? ""),
      nome: String(p.a004_nome ?? ""),
      celular: p.a004_celular ? String(p.a004_celular) : null,
      data_nascimento: p.a004_data_nascimento ? String(p.a004_data_nascimento) : null,
    }));
  }
}
