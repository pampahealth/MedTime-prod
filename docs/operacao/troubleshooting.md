# Troubleshooting

## Porta em uso

- FrontEnd (3000) em uso:
  - Linux/macOS: `lsof -i :3000`
  - Windows PowerShell: `Get-NetTCPConnection -LocalPort 3000`
- API ProjetoRotas (3333) em uso:
  - Linux/macOS: `lsof -i :3333`
  - Windows PowerShell: `Get-NetTCPConnection -LocalPort 3333`
- Backend unificado (3010) em uso:
  - Linux/macOS: `lsof -i :3010`
  - Windows PowerShell: `Get-NetTCPConnection -LocalPort 3010`

## Variaveis de ambiente

- Sempre gere os arquivos locais a partir de `.env.example`.
- Nao versionar `.env`, `.env.local` e `mobile/local.properties`.

## Build mobile falha

- Verifique Java 17.
- Rode `./gradlew clean` (ou `.\gradlew.bat clean` no Windows).
- Reabra projeto no Android Studio e sincronize Gradle.

## Backend unificado e compatibilidade legada

- Preferir execucao do `backend-unificado`.
- O modulo `api-buscas` foi mantido apenas como ponte de compatibilidade.
- Se usar viewer Python legado, execute manualmente quando necessario.

## JSON sem dados esperados

- Verifique se a API usada e a mesma porta exibida na documentacao.
- Confirme se o payload retornado inclui `tomadas` e `datas_hora_tomadas`.
- Reinicie API apos `npm run build` quando rodar a partir de `dist`.

