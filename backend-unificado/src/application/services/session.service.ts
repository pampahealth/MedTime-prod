import { supabase, SUPABASE_SCHEMA } from "../../infra/db/supabase";
import { signToken } from "../../infra/auth/jwt";

type UsuarioRow = {
  a008_id?: string;
  a008_user_email?: string;
  a008_user_senha?: string;
  a008_user_tipo?: string;
};

export class SessionService {
  async login(email: string, password: string) {
    const { data, error } = await supabase
      .schema(SUPABASE_SCHEMA)
      .from("a008_usuario")
      .select("a008_id, a008_user_email, a008_user_senha, a008_user_tipo")
      .eq("a008_user_email", email)
      .limit(1);

    if (error) throw new Error(`Erro ao autenticar: ${error.message}`);
    const row = (data?.[0] ?? null) as UsuarioRow | null;
    if (!row) throw new Error("Credenciais invalidas");

    const senhaBanco = String(row.a008_user_senha ?? "");
    // Compatibilidade: projeto legado armazena senha simples em alguns ambientes.
    const senhaOk = senhaBanco === password;
    if (!senhaOk) throw new Error("Credenciais invalidas");

    const token = signToken({
      sub: String(row.a008_id ?? email),
      email: String(row.a008_user_email ?? email),
      tipo: String(row.a008_user_tipo ?? "user"),
    });

    return {
      token,
      user: {
        id: String(row.a008_id ?? ""),
        email: String(row.a008_user_email ?? email),
        tipo: String(row.a008_user_tipo ?? "user"),
      },
    };
  }
}
