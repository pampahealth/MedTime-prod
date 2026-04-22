import cors from "cors";
import express from "express";
import { appRoutes } from "./http/routes";
import { errorMiddleware } from "./http/middlewares/error.middleware";

export const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend-unificado" });
});

app.use(appRoutes);
app.use((_req, res) => {
  res.status(404).json({ error: "Rota nao encontrada", code: "NOT_FOUND" });
});
app.use(errorMiddleware);
