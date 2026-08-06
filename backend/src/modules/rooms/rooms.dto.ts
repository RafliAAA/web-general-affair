import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1, "Nama ruangan wajib diisi"),
  capacity: z.number().int().positive("Kapasitas harus lebih dari 0"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  facilities: z.array(z.string().min(1)).optional().default([]),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  location: z.string().min(1).optional(),
  facilities: z.array(z.string().min(1)).optional(),
  status: z.enum(["Tersedia", "TidakTersedia"]).optional(),
});

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

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
export type UpdateRoomDTO = z.infer<typeof updateRoomSchema>;
export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type ReviewBookingDTO = z.infer<typeof reviewBookingSchema>;
