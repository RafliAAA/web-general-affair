import { z } from "zod";

export const createDirectorateSchema = z.object({
  directorate_name: z.string().min(1, "Nama direktorat harus diisi"),
  entity_id: z.string().uuid("Entity ID tidak valid"),
});

export type CreateDirectorateDTO = z.infer<typeof createDirectorateSchema>;
