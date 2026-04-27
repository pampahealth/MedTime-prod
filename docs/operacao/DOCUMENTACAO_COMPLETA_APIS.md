# Documentacao Completa das APIs (MedTime)

Este documento descreve, de forma didatica e pratica, as APIs usadas no projeto:

- **API Unificada** (`backend-unificado`) - foco atual de integracao com mobile e consultas consolidadas.
- **API Legada** (`ProjetoRotas`) - CRUD tradicional do schema `medtime` e Swagger legado.

---

## 1) Visao geral rapida

### API Unificada
- Base local: `http://localhost:3010`
- Health: `GET /health`
- Caracteristica principal: consolidacao de dados de receita/paciente/medicamentos para consumo mobile.

### API Legada (ProjetoRotas)
- Base local: `http://localhost:3333`
- Caracteristica principal: CRUD completo por entidade (`/medtime/...`).
- Swagger legado: `http://localhost:3333/api-docs`

> Observacao: no FrontEnd, existe a pagina `http://localhost:3000/docs` com links prontos para todas as rotas.

---

## 2) Como subir as APIs

## API Unificada (`backend-unificado`)
```bash
cd "/home/lucas/Documentos/codigos/MedTime+app/backend-unificado"
npm install
npm run dev
```

## API Legada (`ProjetoRotas`)
```bash
cd "/home/lucas/Documentos/codigos/MedTime+app/MedTime"
npm install
npm run dev:api
```

---

## 3) Autenticacao e autorizacao

### Endpoint de login (API Unificada)
- `POST /sessions`
- URL completa: `http://localhost:3010/sessions`

Payload esperado:
```json
{
  "email": "admin@medtime.com",
  "password": "123456"
}
```

Resposta esperada (200):
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "email": "admin@medtime.com",
    "tipo": "admin"
  }
}
```

### Rotas protegidas por token
Na API Unificada, estas rotas usam `authMiddleware` (Bearer token):
- `/api/v2/*`
- `/medtime/*`

Header:
```http
Authorization: Bearer <jwt>
```

> Se `AUTH_REQUIRED=false` no ambiente, o middleware libera sem token.

---

## 4) API Unificada (`http://localhost:3010`)

## 4.1 Rotas basicas

- `GET /health`
  - URL: `http://localhost:3010/health`
  - Uso: validar se a API esta no ar.

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/health"
```

Exemplo de retorno (200):
```json
{
  "ok": true
}
```

---

## 4.2 Rotas de receitas (consulta consolidada)

Prefixo: `/api`

### 1) Receitas por data
- `GET /api/receitas/por-data`
- URL: `http://localhost:3010/api/receitas/por-data`
- Query:
  - `data_receita_inicio` (ou `data_receita`) - obrigatorio
  - `data_receita_fim` - opcional

Exemplo:
```text
http://localhost:3010/api/receitas/por-data?data_receita_inicio=2026-04-27&data_receita_fim=2026-04-30
```

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/receitas/por-data?data_receita_inicio=2026-04-27&data_receita_fim=2026-04-30"
```

Exemplo de retorno (200):
```json
[
  {
    "id_receita": "21f737de-56a8-40de-9551-84f1b989ecb5",
    "nome_paciente": "MARIA MACOLA MACHADO FERREIRA",
    "cartao_sus": "7054071744905",
    "data_receita": "2026-04-27",
    "medicamentos": [
      {
        "id_medicamento": "BR0267691",
        "nome_medicamento": "METFORMINA 850 MG",
        "tomadas": [
          { "data": "2026-04-27", "hora": "10:55:00" }
        ]
      }
    ]
  }
]
```

Exemplo de retorno de erro (400):
```json
{
  "error": "data_receita invalida"
}
```

### 2) Receitas por nome do paciente
- `GET /api/receitas/por-paciente`
- URL: `http://localhost:3010/api/receitas/por-paciente`
- Query:
  - `nome_paciente` (minimo 2 caracteres)

Exemplo:
```text
http://localhost:3010/api/receitas/por-paciente?nome_paciente=MARIA
```

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/receitas/por-paciente?nome_paciente=MARIA"
```

Exemplo de retorno (200):
```json
[
  {
    "nome_paciente": "MARIA MACOLA MACHADO FERREIRA",
    "cartao_sus": "7054071744905",
    "medicamentos": []
  }
]
```

### 3) Receitas por cartao SUS
- `GET /api/receitas/por-cartao-sus`
- URL: `http://localhost:3010/api/receitas/por-cartao-sus`
- Query:
  - `cartao_sus` (minimo 10 caracteres)

Exemplo:
```text
http://localhost:3010/api/receitas/por-cartao-sus?cartao_sus=7054071744905
```

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/receitas/por-cartao-sus?cartao_sus=7054071744905"
```

Exemplo de retorno (200):
```json
[
  {
    "nome_paciente": "MARIA MACOLA MACHADO FERREIRA",
    "cartao_sus": "7054071744905",
    "data_receita": "2026-04-27",
    "medicamentos": [
      { "nome_medicamento": "METFORMINA 850 MG", "tomadas": [] }
    ]
  }
]
```

### 4) Coleta completa
- `GET /api/coleta/completa`
- URL: `http://localhost:3010/api/coleta/completa`
- Query opcionais:
  - `cartao_sus`
  - `nome_paciente`
  - `data_inicio`
  - `data_fim`
  - `limite` (default interno 200)

Exemplo:
```text
http://localhost:3010/api/coleta/completa?cartao_sus=7054071744905&limite=1
```

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/coleta/completa?cartao_sus=7054071744905&limite=1"
```

Exemplo de retorno (200):
```json
{
  "origem": "coleta_completa",
  "data_envio": "2026-04-27T13:55:00.000Z",
  "dados": [
    {
      "nome_paciente": "MARIA MACOLA MACHADO FERREIRA",
      "cartao_sus": "7054071744905",
      "medicamentos": []
    }
  ]
}
```

---

## 4.3 Rotas de integracao mobile

Prefixo: `/api/mobile`

### 1) Enviar payload para mobile
- `POST /api/mobile/receitas`
- URL: `http://localhost:3010/api/mobile/receitas`

Payload esperado (estrutura minima):
```json
{
  "origem": "viewer_api_tripla",
  "data_envio": "2026-04-27T10:00:00.000Z",
  "dados": [
    {
      "nome_paciente": "MARIA",
      "cartao_sus": "7054071744905",
      "medicamentos": []
    }
  ]
}
```

Exemplo de envio:
```bash
curl -X POST "http://localhost:3010/api/mobile/receitas" \
  -H "Content-Type: application/json" \
  -d '{
    "origem":"viewer_api_tripla",
    "data_envio":"2026-04-27T10:00:00.000Z",
    "dados":[{"nome_paciente":"MARIA","cartao_sus":"7054071744905","medicamentos":[]}]
  }'
```

Exemplo de retorno (202):
```json
{
  "status": "recebido",
  "destino": "app_mobile_pendente",
  "recebido_em": "2026-04-27T10:00:01.000Z",
  "possui_payload": true
}
```

Exemplo de retorno de erro (400):
```json
{
  "error": "Payload invalido para envio ao app mobile",
  "detalhes": [
    {
      "path": ["dados"],
      "message": "Required"
    }
  ]
}
```

### 2) Obter ultimo payload enviado
- `GET /api/mobile/receitas/ultimo`
- URL: `http://localhost:3010/api/mobile/receitas/ultimo`

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/mobile/receitas/ultimo"
```

Exemplo de retorno (200):
```json
{
  "origem": "viewer_api_tripla",
  "data_envio": "2026-04-27T10:00:00.000Z",
  "dados": [{ "nome_paciente": "MARIA", "cartao_sus": "7054071744905" }]
}
```

Exemplo de retorno (404):
```json
{
  "error": "Nenhum payload recebido para mobile ate o momento."
}
```

### 3) Obter ultimo paciente do payload
- `GET /api/mobile/paciente/ultimo`
- URL: `http://localhost:3010/api/mobile/paciente/ultimo`

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/mobile/paciente/ultimo"
```

Exemplo de retorno (200):
```json
{
  "nome_paciente": "MARIA",
  "cartao_sus": "7054071744905",
  "data_envio": "2026-04-27T10:00:00.000Z"
}
```

---

## 4.4 Rotas V2 (protegidas)

Prefixo: `/api/v2`

- `GET /api/v2/resumo-operacional`
- URL: `http://localhost:3010/api/v2/resumo-operacional`
- Requer: `Authorization: Bearer <jwt>`

Exemplo de envio:
```bash
curl -X GET "http://localhost:3010/api/v2/resumo-operacional" \
  -H "Authorization: Bearer <jwt>"
```

Exemplo de retorno (200):
```json
{
  "total_pacientes": 120,
  "total_medicamentos": 540,
  "total_tomadas_hoje": 980
}
```

---

## 4.5 CRUD generico MedTime (protegido)

Prefixo: `/medtime`

Rotas genericas:
- `GET /medtime/:resource`
- `GET /medtime/:resource/:id`
- `POST /medtime/:resource`
- `PUT /medtime/:resource/:id`
- `DELETE /medtime/:resource/:id`

Exemplos:
- `http://localhost:3010/medtime/pacientes`
- `http://localhost:3010/medtime/medicamentos`
- `http://localhost:3010/medtime/receitas`
- `http://localhost:3010/medtime/receita-medicamentos`
- `http://localhost:3010/medtime/receita-horarios`

### Exemplo de envio e retorno para CRUD generico

Listar:
```bash
curl -X GET "http://localhost:3010/medtime/pacientes" \
  -H "Authorization: Bearer <jwt>"
```

Retorno (200):
```json
[
  {
    "id": "uuid-paciente",
    "nome": "MARIA",
    "cartao_sus": "7054071744905"
  }
]
```

Criar:
```bash
curl -X POST "http://localhost:3010/medtime/pacientes" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"JOAO","cartao_sus":"123456789012345"}'
```

Retorno (201):
```json
{
  "id": "novo-uuid",
  "nome": "JOAO",
  "cartao_sus": "123456789012345"
}
```

Atualizar:
```bash
curl -X PUT "http://localhost:3010/medtime/pacientes/novo-uuid" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"JOAO DA SILVA"}'
```

Retorno (200):
```json
{
  "id": "novo-uuid",
  "nome": "JOAO DA SILVA"
}
```

Excluir:
```bash
curl -X DELETE "http://localhost:3010/medtime/pacientes/novo-uuid" \
  -H "Authorization: Bearer <jwt>"
```

Retorno (200/204):
```json
{
  "success": true
}
```

---

## 4.6 Assets de medicamentos

- `GET /assets/medicamentos/<arquivo>`
- Exemplo: `http://localhost:3010/assets/medicamentos/arquivo.png`

---

## 5) API Legada (`http://localhost:3333`)

## 5.1 Swagger legado

- URL correta: `http://localhost:3333/api-docs`

> Se abrir 404, a API nao esta rodando ou foi iniciada em outro contexto.

---

## 5.2 Sessao

- `POST /sessions`
- URL: `http://localhost:3333/sessions`

Exemplo de envio:
```bash
curl -X POST "http://localhost:3333/sessions" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medtime.com","password":"123456"}'
```

Exemplo de retorno (200):
```json
{
  "token": "<jwt>",
  "user": {
    "email": "admin@medtime.com"
  }
}
```

---

## 5.3 Prefixo principal legado: `/medtime`

Entidades CRUD:
- `/medtime/paciente-celulares`
- `/medtime/prefeitura`
- `/medtime/medico`
- `/medtime/medicamentos`
- `/medtime/pacientes`
- `/medtime/receitas`
- `/medtime/receita-medicamentos`
- `/medtime/receita-horarios`
- `/medtime/usuario`
- `/medtime/x001`
- `/medtime/x002`

Padrao por entidade:
- `GET /<entidade>`
- `GET /<entidade>/:id`
- `POST /<entidade>`
- `PUT /<entidade>/:id`
- `DELETE /<entidade>/:id`

Exemplo completo:
- `GET http://localhost:3333/medtime/receitas`
- `GET http://localhost:3333/medtime/receitas/<id>`
- `POST http://localhost:3333/medtime/receitas`

### Exemplo didatico (legado) - receita-horarios

Criar horario:
```bash
curl -X POST "http://localhost:3333/medtime/receita-horarios" \
  -H "Content-Type: application/json" \
  -d '{
    "id_receita_medicamento":"uuid-rm",
    "id_prefeitura":"uuid-prefeitura",
    "horario":"2026-04-27T10:55:00",
    "data_fim":"2026-05-04T23:59:59"
  }'
```

Retorno (201):
```json
{
  "id": "uuid-horario",
  "id_receita_medicamento": "uuid-rm",
  "horario": "2026-04-27T10:55:00"
}
```

Listar por RM:
```bash
curl -X GET "http://localhost:3333/medtime/receita-horarios?id_rm=uuid-rm"
```

Retorno (200):
```json
[
  {
    "id": "uuid-horario",
    "horario": "2026-04-27T10:55:00",
    "data_fim": "2026-05-04T23:59:59"
  }
]
```

---

## 6) Enderecos uteis no FrontEnd

- Lista amigavel de rotas no front: `http://localhost:3000/docs`

---

## 7) Checklist rapido de troubleshooting

### Erro 404 em rota
1. Confirme porta correta (`3010`, `3333` ou `3000`).
2. Confirme API ativa (`/health` na unificada).
3. No legado, use `/api-docs` (nao `/docs`).

### Erro 401
1. Fazer login em `/sessions`.
2. Enviar header `Authorization: Bearer <token>`.
3. Verificar `AUTH_REQUIRED` no ambiente.

### Front nao alcança backend
1. Validar variaveis de ambiente do Front.
2. Validar `USE_BACKEND_PROXY` (quando usando `/next_api`).
3. Validar se backend alvo esta ativo.

---

## 8) Fluxo recomendado para mobile (resumo)

1. Buscar paciente/receita mais recente:
   - `GET /api/receitas/por-cartao-sus` ou `GET /api/coleta/completa`
2. Salvar payload local no app.
3. Comparar payload novo x salvo.
4. Se diferente, substituir e reagendar.

---

## 9) Observacoes finais

- A API Unificada e a Legada convivem no projeto.
- Para novos fluxos, priorize a API Unificada (`3010`).
- Para CRUD historico e Swagger antigo, use a Legada (`3333`).

