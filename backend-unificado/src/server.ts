import { app } from "./app";
import { env } from "./infra/config/env";

app.listen(env.PORT, () => {
  console.log(`Backend unificado rodando na porta ${env.PORT}`);
});
