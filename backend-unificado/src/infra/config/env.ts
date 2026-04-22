import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

if (!process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_KEY) {
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_KEY;
}

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3010),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SCHEMA: z.string().min(1).default("medtime"),
  JWT_SECRET: z.string().min(12),
  JWT_EXPIRES_IN: z.string().default("1d"),
  AUTH_REQUIRED: z
    .string()
    .optional()
    .transform((v) => String(v ?? "false").toLowerCase() === "true"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Variaveis de ambiente invalidas: ${details}`);
}

const isPlaceholderSupabaseUrl = parsed.data.SUPABASE_URL.includes("SEU-PROJETO.supabase.co");
const isPlaceholderSupabaseKey =
  parsed.data.SUPABASE_ANON_KEY === "SUA_CHAVE_SUPABASE" ||
  parsed.data.SUPABASE_ANON_KEY.includes("SUA_CHAVE");
if (isPlaceholderSupabaseUrl || isPlaceholderSupabaseKey) {
  throw new Error(
    "Variaveis de ambiente invalidas: configure SUPABASE_URL e SUPABASE_ANON_KEY reais no arquivo .env."
  );
}

export const env = parsed.data;
