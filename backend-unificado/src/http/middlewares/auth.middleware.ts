import { NextFunction, Request, Response } from "express";
import { env } from "../../infra/config/env";
import { verifyToken } from "../../infra/auth/jwt";
import { HttpError } from "../../domain/http-error";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!env.AUTH_REQUIRED) {
    next();
    return;
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }
  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyToken(token);
    (req as Request & { user?: unknown }).user = payload;
    next();
  } catch {
    next(new HttpError(401, "Token invalido", "AUTH_INVALID_TOKEN"));
  }
}
