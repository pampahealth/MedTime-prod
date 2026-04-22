# Setup macOS

## 1) Dependencias

Com Homebrew (recomendado):

```bash
brew install node python@3.11 openjdk@17
```

Valide:

```bash
node -v
npm -v
python3 --version
java -version
```

## 2) Configurar variaveis de ambiente

```bash
cp .env.example .env
cp MedTime/apps/FrontEnd/.env.example MedTime/apps/FrontEnd/.env.local
cp MedTime/apps/ProjetoRotas/.env.example MedTime/apps/ProjetoRotas/.env
cp testes/api_tripla_26.03/.env.example testes/api_tripla_26.03/.env
```

## 3) Rodar backend principal (unificado)

```bash
cd backend-unificado
npm install
cp .env.example .env
npm run dev
```

## 4) Rodar web (quando aplicavel)

```bash
cd MedTime
npm run dev:front
```

## 5) Rodar API legada de integracao (opcional)

```bash
cd api-buscas
npm install
npm start
```

Se necessario, abra a interface Python manualmente:

```bash
python3 viewer_api_tripla.py
```

## 6) Build do mobile

```bash
cd mobile
./gradlew assembleDebug
```

