import { z } from "zod";

export const DisposalMethodEnum = z.enum(["Jual", "Hibah"]);

export const CreateDisposalItemSchema = z.object({
  asset_id: z.uuid(),
  method: DisposalMethodEnum,
  notes: z.string().nullable(),
});

export const CreateDisposalSchema = z.object({
  memo_number: z.string().min(1),
  memo_date: z.coerce.date(),
  subject: z.string().min(1),
  description: z.string().min(1),

  items: z.array(CreateDisposalItemSchema)
});

export type CreateDisposalInput = z.infer<typeof CreateDisposalSchema>;
