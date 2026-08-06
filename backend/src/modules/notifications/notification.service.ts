import { NotificationType, Role } from "@prisma/client";
import notificationRepository from "./notification.repository";
import type { CreateNotificationDTO } from "./notification.dto";
import { sendEmail } from "../../helper/email"; // Sesuaikan path jika beda
import { generateEmailTemplate } from "../../helper/email.template"; // Sesuaikan path jika beda
// IMPORT FUNGSI SOCKET.IO DARI CONFIG
import { sendNotificationToUser } from "../../config/socket";

interface SendToRolesDTO {
  roles: Role[];
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

const sendNotification = async (data: CreateNotificationDTO) => {
  const result = await notificationRepository.createNotification(data);
  if (!result) throw new Error("Failed to create notification");

  sendNotificationToUser(data.user_id, result);

  if (data.sendEmailFlag !== false) {
    const user = await notificationRepository.findUserEmailById(data.user_id);

    if (user?.email) {
      const frontendUrl = process.env.APP_URL || "http://localhost:5173";
      const fullLink = data.link ? `${frontendUrl}${data.link}` : frontendUrl;

      const userName = user.profile?.name || "Pengguna";

      const htmlContent = generateEmailTemplate(
        data.title,
        data.message,
        data.link,
        fullLink,
        userName,
      );

      sendEmail({
        to: user.email,
        subject: data.title,
        text: data.message,
        html: htmlContent,
      }).catch((err) => console.error("Email Error:", err));
    }
  }

  return result;
};

const sendNotificationToRoles = async (data: SendToRolesDTO) => {
  const users = await notificationRepository.findUserIdsByRoles(data.roles);

  const payloads = users.map((user) => ({
    user_id: user.user_id,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link ?? null,
  }));

  if (payloads.length > 0) {
    await notificationRepository.createManyNotifications(payloads);
  }

  for (const user of users) {
    const notifData = {
      user_id: user.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link ?? null,
      is_read: false,
      createdAt: new Date().toISOString(),
    };
    sendNotificationToUser(user.user_id, notifData);
  }

  const frontendUrl = process.env.APP_URL || "http://localhost:5173";
  const fullLink = data.link ? `${frontendUrl}${data.link}` : frontendUrl;

  for (const user of users) {
    if (user.email) {
      const userName = user.profile?.name || "Pengguna";
      const htmlContent = generateEmailTemplate(
        data.title,
        data.message,
        data.link,
        fullLink,
        userName,
      );

      sendEmail({
        to: user.email,
        subject: data.title,
        text: data.message,
        html: htmlContent,
      }).catch((err) => console.error("Email Error:", err));
    }
  }
};

const getMyNotifications = async (user_id: string) => {
  const notifications = await notificationRepository.findManyByUserId(user_id);
  const unreadCount = await notificationRepository.countUnreadByUserId(user_id);

  if (!notifications) throw new Error("Failed to fetch notifications");

  return { notifications, unreadCount };
};

const readNotification = async (notification_id: string, user_id: string) => {
  const result = await notificationRepository.markAsRead(
    notification_id,
    user_id,
  );
  if (!result) throw new Error("Failed to mark notification as read");
  return result;
};

const readAllNotifications = async (user_id: string) => {
  const result = await notificationRepository.markAllAsRead(user_id);
  if (!result) throw new Error("Failed to mark all notifications as read");
  return result;
};

export default {
  sendNotification,
  sendNotificationToRoles,
  getMyNotifications,
  readNotification,
  readAllNotifications,
};
