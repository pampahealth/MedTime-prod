# Setup Windows

## 1) Dependencias

- Git
- Node.js 20 LTS
- Python 3.10+ (com Tkinter)
- Java 17
- Android Studio

Valide no PowerShell:

```powershell
node -v
npm -v
python --version
java -version
```

## 2) Configurar variaveis de ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
Copy-Item MedTime/apps/FrontEnd/.env.example MedTime/apps/FrontEnd/.env.local
Copy-Item MedTime/apps/ProjetoRotas/.env.example MedTime/apps/ProjetoRotas/.env
Copy-Item testes/api_tripla_26.03/.env.example testes/api_tripla_26.03/.env
```

## 3) Rodar backend principal (unificado)

```powershell
cd backend-unificado
npm install
Copy-Item .env.example .env
npm run dev
```

## 4) Rodar web (quando aplicavel)

```powershell
cd MedTime
npm run dev:front
```

## 5) Rodar API legada de integracao (opcional)

```powershell
cd api-buscas
npm install
npm start
```

Se a interface Python nao abrir automaticamente, execute manualmente:

```powershell
python viewer_api_tripla.py
```

## 6) Build do mobile

```powershell
cd mobile
.\gradlew.bat assembleDebug
```

