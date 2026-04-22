# API Tripla (`api_tripla_26.03`) - LEGADO

Este modulo foi desativado como backend principal.
Use `../backend-unificado` para desenvolvimento e execucao.

Compatibilidade:

- os scripts deste modulo encaminham para `backend-unificado`.
- os contratos de rotas legadas foram preservados no backend novo.

API de integracao para consultas de receitas e envio de payload ao app mobile.

## Setup rapido

```bash
npm install
cp .env.example .env
npm start
```

## Endpoints principais

- `GET /health`
- `GET /api/receitas/por-data`
- `GET /api/receitas/por-paciente`
- `GET /api/receitas/por-cartao-sus`
- `GET /api/coleta/completa`
- `POST /api/mobile/receitas`
- `GET /api/mobile/receitas/ultimo`

### Coleta completa de dados

Endpoint para retornar todos os dados necessarios de receitas, pacientes, medicamentos e tomadas:

- `GET /api/coleta/completa`
- Filtros opcionais:
  - `cartao_sus`
  - `nome_paciente`
  - `data_inicio` (YYYY-MM-DD)
  - `data_fim` (YYYY-MM-DD)
  - `limite` (quando sem filtros; padrao 200)

Exemplos:

```bash
curl "http://localhost:3010/api/coleta/completa"
curl "http://localhost:3010/api/coleta/completa?cartao_sus=898003337197753"
curl "http://localhost:3010/api/coleta/completa?data_inicio=2026-04-01&data_fim=2026-04-30"
```

## Interface Python

A interface `viewer_api_tripla.py` pode abrir junto com a API conforme configuracao de ambiente.
Se nao abrir automaticamente, execute manualmente:

- Linux/macOS: `python3 viewer_api_tripla.py`
- Windows: `python viewer_api_tripla.py`

Ou use:

- Linux/macOS: `npm run start:ui`
- Windows: `npm run start:ui:win`

## Referencias do monorepo

- `../../README.md`
- `../../docs/setup/`
- `../../docs/operacao/troubleshooting.md`
