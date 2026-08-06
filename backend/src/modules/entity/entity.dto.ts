import { z } from "zod";

export const createEntitySchema = z.object({
  entity_name: z.string().min(1, "Nama entity harus diisi"),
});

export type CreateEntityDTO = z.infer<typeof createEntitySchema>;
