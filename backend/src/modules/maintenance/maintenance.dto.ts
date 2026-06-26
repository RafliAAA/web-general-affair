import { z } from "zod";

export const createMaintenanceSchema = z.object({
  asset_id: z.string().uuid(),
  reported_by: z.string().uuid(),
  description: z.string().min(1, "Description is required"),
});

export const verifyMaintenanceSchema = z.object({
  maintenance_id: z.string().uuid(),
  verified_by: z.string().uuid(),
});

export const rejectMaintenanceSchema = z.object({
  maintenance_id: z.string().uuid(),
  verified_by: z.string().uuid(),
  rejection_reason: z.string().min(1, "Rejection reason is required"),
});

export const takeMaintenanceSchema = z.object({
  maintenance_id: z.string().uuid(),
  taken_by: z.string().uuid(),
});

export const completeMaintenanceSchema = z.object({
  maintenance_id: z.string().uuid(),
  resolution_notes: z.string().min(1, "Resolution notes is required"),
});

export const cannotRepairSchema = z.object({
  maintenance_id: z.string().uuid(),
  form_number: z.string().min(1),
  description: z.string().min(1),
  issue: z.string().min(1),
  handling: z.string().min(1),
  recommendation: z.string().min(1),
});

export const createActualizationFormSchema = z.object({
  maintenance_id: z.string().uuid(),
  form_number: z.string().min(1, "Form number is required"),
  user_name: z.string().min(1, "User name is required"),
  form_date: z.coerce.date(),
  duration_minutes: z.number().int().positive(),
  description: z.string().min(1, "Description is required"),
  issue: z.string().min(1, "Issue is required"),
  handling: z.string().min(1, "Handling is required"),
  recommendation: z.string().min(1, "Recommendation is required"),
  created_by: z.string().uuid(),
});

export type CreateMaintenanceDTO = z.infer<typeof createMaintenanceSchema>;
export type VerifyMaintenanceDTO = z.infer<typeof verifyMaintenanceSchema>;
export type RejectMaintenanceDTO = z.infer<typeof rejectMaintenanceSchema>;
export type TakeMaintenanceDTO = z.infer<typeof takeMaintenanceSchema>;
export type CompleteMaintenanceDTO = z.infer<typeof completeMaintenanceSchema>;
export type CannotRepairDTO = z.infer<typeof cannotRepairSchema>;
export type CreateActualizationFormDTO = z.infer<typeof createActualizationFormSchema>;