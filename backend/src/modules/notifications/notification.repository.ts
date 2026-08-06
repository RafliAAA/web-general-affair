import { Role } from "@prisma/client";
import prisma from "../../config/prisma";
import type { CreateNotificationDTO } from "./notification.dto";

const createNotification = async (data: CreateNotificationDTO) => {
  return await prisma.notification.create({
    data: {
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link ?? null,
    },
  });
};

const createManyNotifications = async (data: any[]) => {
  return await prisma.notification.createMany({
    data: data,
    skipDuplicates: true,
  });
};

const findManyByUserId = async (user_id: string, take: number = 15) => {
  return await prisma.notification.findMany({
    where: { user_id },
    orderBy: { createdAt: "desc" },
    take,
  });
};

const countUnreadByUserId = async (user_id: string) => {
  return await prisma.notification.count({
    where: { user_id, is_read: false },
  });
};

const markAsRead = async (notification_id: string, user_id: string) => {
  return await prisma.notification.updateMany({
    where: { notification_id, user_id },
    data: { is_read: true },
  });
};

const markAllAsRead = async (user_id: string) => {
  return await prisma.notification.updateMany({
    where: { user_id, is_read: false },
    data: { is_read: true },
  });
};

const findUserIdsByRoles = async (roles: Role[]) => {
  return await prisma.user.findMany({
    where: { role: { in: roles } },
    select: {
      user_id: true,
      email: true,
      profile: {
        select: { name: true },
      },
    },
  });
};

const findUserEmailById = async (user_id: string) => {
  return await prisma.user.findUnique({
    where: { user_id },
    select: {
      email: true,
      profile: {
        select: { name: true },
      },
    },
  });
};

export default {
  createNotification,
  createManyNotifications, 
  findManyByUserId,
  countUnreadByUserId,
  markAsRead,
  markAllAsRead,
  findUserIdsByRoles,
  findUserEmailById,
};
