import { Request, Response } from "express";
import { MedtimeCrudService } from "../../application/services/medtime-crud.service";

export class MedtimeController {
  constructor(private readonly service: MedtimeCrudService) {}

  async list(req: Request, res: Response): Promise<void> {
    const resource = String(req.params.resource ?? "");
    const query = Object.fromEntries(
      Object.entries(req.query).map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : v != null ? String(v) : undefined])
    ) as Record<string, string | string[] | undefined>;
    const data = await this.service.list(resource, query);
    res.status(200).json(data);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const resource = String(req.params.resource ?? "");
    const id = String(req.params.id ?? "");
    const data = await this.service.getById(resource, id);
    if (!data) {
      res.status(404).json({ error: "Registro nao encontrado" });
      return;
    }
    res.status(200).json(data);
  }

  async create(req: Request, res: Response): Promise<void> {
    const resource = String(req.params.resource ?? "");
    const created = await this.service.create(resource, req.body ?? {});
    res.status(201).json(created);
  }

  async update(req: Request, res: Response): Promise<void> {
    const resource = String(req.params.resource ?? "");
    const id = String(req.params.id ?? "");
    const updated = await this.service.update(resource, id, req.body ?? {});
    if (!updated) {
      res.status(404).json({ error: "Registro nao encontrado" });
      return;
    }
    res.status(200).json(updated);
  }

  async remove(req: Request, res: Response): Promise<void> {
    const resource = String(req.params.resource ?? "");
    const id = String(req.params.id ?? "");
    await this.service.remove(resource, id);
    res.status(204).send();
  }
}
