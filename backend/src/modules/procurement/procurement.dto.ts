import { z } from "zod";

const ProcurementItemSchema = z.object({
  part_number: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  quantity_approved: z.number().int().default(0),
  unit_of_measure: z.string().min(1), 
});

export const CreateProcurementSchema = z.object({
  pr_date: z.coerce.date(),
  due_date: z.coerce.date(),
  end_user: z.string().min(1),
  remarks: z.string().nullable(),
  actualization_id: z.string().uuid().optional().or(z.literal("")),
  items: z.array(ProcurementItemSchema).min(1, "Minimal harus mengajukan 1 barang"),
});

const UpdateProcurementItemSchema = z.object({
  part_number: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  quantity_approved: z.number().int().nonnegative(),
  unit_of_measure: z.string().min(1),
  asset_category_id: z.string().uuid().optional().or(z.literal("")),
});

export const UpdateProcurementSchema = z.object({
  pr_date: z.coerce.date(),
  due_date: z.coerce.date(),
  end_user: z.string().min(1),
  remarks: z.string().nullable(),
  status: z.enum(["Menunggu", "Disetujui", "Ditolak"]).optional(), 
  items: z.array(UpdateProcurementItemSchema).min(1, "Minimal harus ada 1 barang"),
});


export type CreateProcurementInput = z.infer<typeof CreateProcurementSchema>;
export type UpdateProcurementInput = z.infer<typeof UpdateProcurementSchema>;