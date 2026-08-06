import { z } from "zod";

export const createHandoverSchema = z.object({
  user_id: z.uuid(),
  handover_date: z.coerce.date(),
  entity_id: z.uuid(),
  directorate_id: z.uuid(),
  items: z
    .array(
      z.object({
        asset_id: z.string().uuid(),
        notes: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 aset harus dipilih"),
  recipient_type: z.enum(["Personal", "Divisi"]).default("Personal"),
});

export const returnHandoverSchema = z.object({
  return_notes: z.string().optional(),
});

export type CreateHandoverDTO = z.infer<typeof createHandoverSchema>;
export type ReturnHandoverDTO = z.infer<typeof returnHandoverSchema>;
