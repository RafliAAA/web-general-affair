import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import type { CreateUserByAdminDTO, UpdateUserDTO } from "./user.dto";

const createUserByAdmin = async (data: CreateUserByAdminDTO) => {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new Error("Email already registered");

    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        profile: {
          create: {
            name: data.name,
            entity_id: data.entity_id || null,
            directorate_id: data.directorate_id || null,
          },
        },
      },
      include: {
        profile: {
          include: {
            entity: true,
            directorate: true,
          },
        },
      },
    });

    return newUser;
  });
};

const getAllUsers = async (search?: string) => {
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      {
        email: {
          contains: search,
        },
      },
      {
        profile: {
          name: {
            contains: search,
          },
        },
      },
    ];
  }

  return prisma.user.findMany({
    where,
    include: {
      profile: {
        // PERBAIKAN: Hilangkan 'select', pakai 'include' saja agar entity & directorate masuk
        include: {
          entity: true,
          directorate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getUserById = async (user_id: string) => {
  return await prisma.user.findUnique({
    where: { user_id },
    include: {
      profile: {
        include: {
          entity: true,
          directorate: true,
        },
      },
      borrows: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { asset: true },
      },
    },
  });
};

const updateUser = async (user_id: string, data: UpdateUserDTO) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { user_id } });
    if (!user) throw new Error("User not found");

    return await tx.user.update({
      where: { user_id },
      data: {
        ...(data.email ? { email: data.email } : {}),
        ...(data.password ? { password: data.password } : {}),
        ...(data.role ? { role: data.role } : {}),
        profile: {
          update: {
            ...(data.name ? { name: data.name } : {}),
            ...(data.entity_id ? { entity_id: data.entity_id } : {}),
            ...(data.directorate_id
              ? { directorate_id: data.directorate_id }
              : {}),
          },
        },
      },
      include: {
        profile: {
          include: {
            entity: true,
            directorate: true,
          },
        },
      },
    });
  });
};

const deleteUser = async (user_id: string) => {
  return await prisma.user.delete({
    where: { user_id },
  });
};

export default {
  createUserByAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
