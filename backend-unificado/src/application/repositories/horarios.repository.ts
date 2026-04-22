import { supabase, SUPABASE_SCHEMA } from "../../infra/db/supabase";
import { ReceitaHorario } from "../../domain/entities";

export class HorariosRepository {
  async listarProximos(limit = 1000): Promise<ReceitaHorario[]> {
    const safeLimit = Math.max(1, Math.min(5000, limit));
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from("a007_receita_horarios")
      .select("a007_id_horario,a007_id_rm,a007_data_hora_disparo,a007_tomou,a007_tentativas")
      .gte("a007_data_hora_disparo", new Date().toISOString())
      .order("a007_data_hora_disparo", { ascending: true })
      .limit(safeLimit);
    if (error) throw new Error(`Erro ao listar horarios: ${error.message}`);
    return (data ?? []).map((h) => ({
      id: String(h.a007_id_horario),
      id_rm: String(h.a007_id_rm),
      data_hora_disparo: String(h.a007_data_hora_disparo),
      tomou: h.a007_tomou == null ? null : Boolean(h.a007_tomou),
      tentativas: Number(h.a007_tentativas ?? 0),
    }));
  }
}
