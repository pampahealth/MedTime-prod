# Setup Linux

## 1) Dependencias do sistema

```bash
sudo apt update
sudo apt install -y git curl python3 python3-tk openjdk-17-jdk
```

Instale Node.js 20 LTS (via nvm recomendado) e confirme:

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

## 6) Build do mobile

```bash
cd mobile
./gradlew assembleDebug
```

