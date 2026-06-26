import prisma from "../../config/prisma";
import type { CreateUserByAdminDTO, UpdateUserDTO } from "./user.dto";

const createUserByAdmin = async (data: CreateUserByAdminDTO) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new Error("Email already registered");

    // 2. Buat user baru sekaligus dengan profile-nya
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: data.password, // Catatan: di-hash di Service Layer sebelum masuk ke sini
        role: data.role,
        profile: {
          create: {
            name: data.name,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return newUser;
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      profile: {
        select: {
          profile_id: true,
          name: true,
          foto_profil: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (user_id: string) => {
  return await prisma.user.findUnique({
    where: { user_id },
    include: {
      profile: true,
      borrows: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { asset: true },
      },
    },
  });
};

// const updateUser = async (user_id: string, data: UpdateUserDTO) => {
//   return await prisma.$transaction(async (tx) => {
//     const user = await tx.user.findUnique({ where: { user_id } });
//     if (!user) throw new Error("User not found");

//     return await tx.user.update({
//       where: { user_id },
//       data: {
//         email: data.email,
//         password: data.password,
//         role: data.role,
//         profile: {
//           update: {
//             name: data.name,
//             foto_profil: data.foto_profil,
//           },
//         },
//       },
//       include: { profile: true },
//     });
//   });
// };

export default {
  createUserByAdmin,
  getAllUsers,
  getUserById,
//   updateUser,
};