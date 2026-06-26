import { z } from "zod";
import { Role } from "@prisma/client";

export const CreateUserByAdminSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(Role),
  name: z.string().min(1, "Nama karyawan harus diisi"),
});

export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(Role).optional(),
  name: z.string().min(1).optional(),
  foto_profil: z.url().optional(),
});

export type CreateUserByAdminDTO = z.infer<typeof CreateUserByAdminSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
