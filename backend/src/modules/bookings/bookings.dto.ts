import { z } from "zod"

export const createBookingSchema = z
  .object({
    room_id: z.string().uuid(),
    date: z.coerce.date(),
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam harus HH:mm"),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam harus HH:mm"),
    purpose: z.string().min(1, "Keperluan wajib diisi"),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["end_time"],
  });

export const reviewBookingSchema = z
  .object({
    status: z.enum(["Disetujui", "Ditolak"]),
    reject_notes: z.string().optional(),
  })
  .refine((data) => data.status !== "Ditolak" || !!data.reject_notes, {
    message: "Catatan penolakan wajib diisi jika ditolak",
    path: ["reject_notes"],
  });

  export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
  export type ReviewBookingDTO = z.infer<typeof reviewBookingSchema>;
