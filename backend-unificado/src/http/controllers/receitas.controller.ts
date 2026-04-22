import { Request, Response } from "express";
import { z } from "zod";
import { ReceitasService } from "../../application/services/receitas.service";

const dataSchema = z.string().min(2, "data_receita invalida");
const nomeSchema = z.string().min(2, "nome_paciente deve ter ao menos 2 caracteres");
const cartaoSchema = z.string().min(10, "cartao_sus invalido");

export class ReceitasController {
  constructor(private readonly service: ReceitasService) {}

  async porData(req: Request, res: Response): Promise<void> {
    const dataInicio = String(req.query.data_receita_inicio ?? req.query.data_receita ?? "");
    const dataFim = String(req.query.data_receita_fim ?? "").trim();

    const parsed = dataSchema.safeParse(dataInicio);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Parametro invalido" });
      return;
    }

    if (!dataFim) {
      const result = await this.service.porData(parsed.data);
      res.status(200).json(result);
      return;
    }

    const parsedFim = dataSchema.safeParse(dataFim);
    if (!parsedFim.success) {
      res.status(400).json({ error: parsedFim.error.issues[0]?.message ?? "Parametro invalido" });
      return;
    }

    const inicio = parsed.data <= parsedFim.data ? parsed.data : parsedFim.data;
    const fim = parsed.data <= parsedFim.data ? parsedFim.data : parsed.data;
    const result = await this.service.porIntervaloData(inicio, fim);
    res.status(200).json(result);
  }

  async porNomePaciente(req: Request, res: Response): Promise<void> {
    const parsed = nomeSchema.safeParse(String(req.query.nome_paciente ?? ""));
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Parametro invalido" });
      return;
    }
    const result = await this.service.porNomePaciente(parsed.data);
    res.status(200).json(result);
  }

  async porCartaoSus(req: Request, res: Response): Promise<void> {
    const parsed = cartaoSchema.safeParse(String(req.query.cartao_sus ?? ""));
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Parametro invalido" });
      return;
    }
    const result = await this.service.porCartaoSus(parsed.data);
    res.status(200).json(result);
  }

  async coletaCompleta(req: Request, res: Response): Promise<void> {
    const payload = await this.service.coletaCompleta({
      cartao_sus: String(req.query.cartao_sus ?? ""),
      nome_paciente: String(req.query.nome_paciente ?? ""),
      data_inicio: String(req.query.data_inicio ?? ""),
      data_fim: String(req.query.data_fim ?? ""),
      limite: Number(req.query.limite ?? 200),
    });
    res.status(200).json(payload);
  }
}
