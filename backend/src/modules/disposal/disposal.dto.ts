import { z } from "zod";

export const DisposalMethodEnum = z.enum(["Jual", "Hibah", "Kirim"]);

export const CreateDisposalItemSchema = z.object({
  asset_id: z.string().uuid(),
  method: DisposalMethodEnum,
  notes: z.string().nullable(),
  recipient_name: z.string().optional().or(z.literal("")),

});

export const CreateDisposalSchema = z.object({
  memo_date: z.coerce.date(),
  subject: z.string().min(1),
  cc: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  description: z.string().min(1),
  items: z.array(CreateDisposalItemSchema),
});

export const UpdateDisposalHeaderSchema = z.object({
  memo_date: z.coerce.date(),
  subject: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  cc: z.string().min(1),
  description: z.string(),
});

export const AddDisposalItemsSchema = z.object({
  items: z.array(CreateDisposalItemSchema).min(1),
});

export type CreateDisposalInput = z.infer<typeof CreateDisposalSchema>;
export type UpdateDisposalHeaderInput = z.infer<
  typeof UpdateDisposalHeaderSchema
>;
export type AddDisposalItemsInput = z.infer<typeof AddDisposalItemsSchema>;
