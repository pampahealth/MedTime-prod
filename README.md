# Projeto Rotas + Front

Monorepo com **FrontEnd** (Next.js) e **ProjetoRotas** (API Express + Supabase) para o sistema MedTime.

## Estrutura

```
.
├── apps/
│   ├── FrontEnd/     # Aplicação Next.js (porta 3000)
│   └── ProjetoRotas/ # API Express (porta 3333)
├── README.md
├── README-SINCRONIZACAO.md
├── .env.example
└── .gitignore
```

Raiz enxuta: só `apps/` (onde ficam as duas aplicações), READMEs e config.

## Quick start

### Só o FrontEnd (usa API interna / PostgREST)

```bash
cd apps/FrontEnd
cp .env.example .env
# Ajuste POSTGREST_*, JWT_SECRET etc.
pnpm install && pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Só o Backend (ProjetoRotas)

```bash
cd apps/ProjetoRotas
cp .env.example .env
# Ajuste SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET
pnpm install && pnpm dev
```

API em [http://localhost:3333](http://localhost:3333). Swagger: `http://localhost:3333/api-docs`.

### Front + Backend sincronizados (proxy)

1. Subir o ProjetoRotas (ver acima).
2. Em `apps/FrontEnd`, no `.env`:
   - `USE_BACKEND_PROXY=true`
   - `API_BACKEND_URL=http://localhost:3333`
3. Rodar o FrontEnd: `cd apps/FrontEnd && pnpm dev`.

Detalhes em [README-SINCRONIZACAO.md](./README-SINCRONIZACAO.md).

## Variáveis de ambiente

- **FrontEnd**: `apps/FrontEnd/.env.example` (PostgREST, auth, proxy).
- **ProjetoRotas**: `apps/ProjetoRotas/.env.example` (Supabase, JWT).

## Documentação

- [Sincronização Front ↔ Backend](./README-SINCRONIZACAO.md)
- FrontEnd: `apps/FrontEnd/README.md`, `apps/FrontEnd/docs/`
- ProjetoRotas: `apps/ProjetoRotas/base_do_supabase.sql` (schema)
