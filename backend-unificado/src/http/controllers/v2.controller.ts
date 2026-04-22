import { Request, Response } from "express";
import { CatalogoService } from "../../application/services/catalogo.service";

export class V2Controller {
  constructor(private readonly service: CatalogoService) {}

  async resumo(req: Request, res: Response): Promise<void> {
    const data = await this.service.resumoOperacional();
    res.status(200).json(data);
  }
}
