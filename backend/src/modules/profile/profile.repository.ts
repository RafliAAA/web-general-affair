import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import type { UpdateProfileDTO } from "./profile.dto";

const getProfileByUserId = async (user_id: string) => {
  return await prisma.user.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      email: true,
      profile: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });
};

const updateProfile = async (user_id: string, data: UpdateProfileDTO) => {
  const updateData: Prisma.ProfileUpdateInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.photo !== undefined) {
    updateData.photo = data.photo;
  }

  return await prisma.user.update({
    where: { user_id },
    data: {
      profile: {
        upsert: {
          create: {
            name: data.name ?? null,
            photo: data.photo ?? null,
          },
          update: updateData,
        },
      },
    },
    select: {
      user_id: true,
      email: true,
      role: true,
      profile: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });
};

export default {
  getProfileByUserId,
  updateProfile,
};
