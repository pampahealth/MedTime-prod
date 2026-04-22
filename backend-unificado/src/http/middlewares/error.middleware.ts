import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../domain/http-error";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }
  const message = err instanceof Error ? err.message : "Erro interno";
  res.status(500).json({ error: message, code: "INTERNAL_ERROR" });
}
