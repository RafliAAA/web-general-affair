import api from "@/lib/axios";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const readNotification = async (notification_id: string) => {
  const res = await api.patch(`/notifications/${notification_id}/read`);
  return res.data.data;
};

export const readAllNotifications = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data.data;
};

export default {
  getNotifications,
  readNotification,
  readAllNotifications,
};
