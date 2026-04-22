import { z } from "zod";

export const mobilePayloadSchema = z.object({
  origem: z.string().optional(),
  data_envio: z.string().optional(),
  dados: z.unknown(),
});

export type MobilePayload = z.infer<typeof mobilePayloadSchema>;
