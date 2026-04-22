import { Request, Response } from "express";
import { z } from "zod";
import { SessionService } from "../../application/services/session.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class SessionsController {
  constructor(private readonly service: SessionService) {}

  async login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Payload invalido" });
      return;
    }

    try {
      const result = await this.service.login(parsed.data.email, parsed.data.password);
      res.status(200).json(result);
    } catch {
      res.status(401).json({ error: "Credenciais invalidas" });
    }
  }
}
