import { supabase, SUPABASE_SCHEMA } from "../../infra/db/supabase";

type ReceitaRaw = {
  a005_data_receita: string | null;
  a004_pacientes:
    | {
        a004_cartao_sus: string | null;
        a004_nome: string | null;
      }
    | Array<{
        a004_cartao_sus: string | null;
        a004_nome: string | null;
      }>;
  a006_receita_medicamentos?: Array<{
    a003_medicamentos:
      | { a003_nome: string; a003_imagem_base64: string | null }
      | Array<{ a003_nome: string; a003_imagem_base64: string | null }>;
    a007_receita_horarios?: Array<{ a007_data_hora_disparo?: string | null }>;
  }>;
};

export class ReceitasRepository {
  private readonly pageSize = 1000;

  private readonly baseSelect = `
    a005_id_receita,
    a005_data_receita,
    a005_id_paciente,
    a004_pacientes!inner(
      a004_id_paciente,
      a004_cartao_sus,
      a004_nome
    ),
    a006_receita_medicamentos(
      a003_medicamentos!inner(
        a003_nome,
        a003_imagem_base64
      ),
      a007_receita_horarios(
        a007_data_hora_disparo
      )
    )
  `;

  private async loadPaged(
    queryFactory: (from: number, to: number) => Promise<{ data: ReceitaRaw[] | null; error: { message: string } | null }>
  ): Promise<ReceitaRaw[]> {
    const result: ReceitaRaw[] = [];
    let from = 0;
    while (true) {
      const to = from + this.pageSize - 1;
      const { data, error } = await queryFactory(from, to);
      if (error) throw new Error(`Erro ao paginar receitas: ${error.message}`);
      const chunk = data ?? [];
      result.push(...chunk);
      if (chunk.length < this.pageSize) break;
      from += this.pageSize;
    }
    return result;
  }

  buscarPorData(dataReceita: string): Promise<ReceitaRaw[]> {
    return this.loadPaged(async (from, to) =>
      (await supabase
        .schema(SUPABASE_SCHEMA)
        .from("a005_receitas")
        .select(this.baseSelect)
        .eq("a005_data_receita", dataReceita)
        .order("a005_data_receita", { ascending: true })
        .range(from, to)) as unknown as { data: ReceitaRaw[] | null; error: { message: string } | null }
    );
  }

  buscarPorIntervaloData(dataInicio: string, dataFim: string): Promise<ReceitaRaw[]> {
    return this.loadPaged(async (from, to) =>
      (await supabase
        .schema(SUPABASE_SCHEMA)
        .from("a005_receitas")
        .select(this.baseSelect)
        .gte("a005_data_receita", dataInicio)
        .lte("a005_data_receita", dataFim)
        .order("a005_data_receita", { ascending: true })
        .range(from, to)) as unknown as { data: ReceitaRaw[] | null; error: { message: string } | null }
    );
  }

  buscarPorNomePaciente(nomePaciente: string): Promise<ReceitaRaw[]> {
    return this.loadPaged(async (from, to) =>
      (await supabase
        .schema(SUPABASE_SCHEMA)
        .from("a005_receitas")
        .select(this.baseSelect)
        .ilike("a004_pacientes.a004_nome", `%${nomePaciente}%`)
        .order("a005_data_receita", { ascending: true })
        .range(from, to)) as unknown as { data: ReceitaRaw[] | null; error: { message: string } | null }
    );
  }

  async buscarPorCartaoSus(cartaoSus: string): Promise<ReceitaRaw[]> {
    const { data: pacientes, error: pacientesError } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from("a004_pacientes")
      .select("a004_id_paciente, a004_cartao_sus")
      .eq("a004_ativo", true);

    if (pacientesError) {
      throw new Error(`Erro ao buscar pacientes por cartao SUS: ${pacientesError.message}`);
    }

    const ids = (pacientes ?? [])
      .filter((p) => String(p.a004_cartao_sus ?? "").replace(/\D/g, "") === cartaoSus.replace(/\D/g, ""))
      .map((p) => p.a004_id_paciente)
      .filter(Boolean);

    if (ids.length === 0) return [];

    return this.loadPaged(async (from, to) =>
      (await supabase
        .schema(SUPABASE_SCHEMA)
        .from("a005_receitas")
        .select(this.baseSelect)
        .in("a005_id_paciente", ids)
        .order("a005_data_receita", { ascending: true })
        .range(from, to)) as unknown as { data: ReceitaRaw[] | null; error: { message: string } | null }
    );
  }

  async buscarRecentes(limite = 200): Promise<ReceitaRaw[]> {
    const safeLimit = Math.max(1, Math.min(1000, Number(limite) || 200));
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from("a005_receitas")
      .select(this.baseSelect)
      .order("a005_data_receita", { ascending: false })
      .limit(safeLimit);
    if (error) throw new Error(`Erro ao buscar receitas recentes: ${error.message}`);
    return data ?? [];
  }
}
