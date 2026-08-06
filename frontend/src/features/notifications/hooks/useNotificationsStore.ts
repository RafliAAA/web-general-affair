import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import notificationService from "../services/notificationService";
import type { NotificationItem } from "@/types/notifications";

// 1. Jangan langsung di-init, biarkan null dulu
let socket: Socket | null = null;

// 2. Fungsi untuk menyalakan socket (dipanggil setelah login)
const initSocket = () => {
  // Kalau socket sudah nyala, jangan di-init lagi
  if (socket) return;

  socket = io("http://localhost:5000", {
    withCredentials: true,
  });

  // Listener untuk notifikasi real-time
  socket.on("new_notification", (newNotif: NotificationItem) => {
    useNotificationStore.setState((state) => ({
      notifications: [newNotif, ...(state.notifications || [])].slice(0, 15),
      unreadCount: (state.unreadCount || 0) + 1,
    }));
  });
};

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notification_id: string, is_read: boolean) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    initSocket();

    try {
      const data = await notificationService.getNotifications();
      set({
        notifications: data?.notifications || [],
        unreadCount: data?.unreadCount || 0,
      });
    } catch (error) {
      console.error("Gagal fetch notifikasi:", error);
      set({ notifications: [], unreadCount: 0 });
    }
  },

  markAsRead: async (notification_id, is_read) => {
    if (!is_read) {
      try {
        await notificationService.readNotification(notification_id);
        set((state) => ({
          notifications: (state.notifications || []).map((n) =>
            n.notification_id === notification_id ? { ...n, is_read: true } : n,
          ),
          unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
        }));
      } catch (error) {
        console.error("Gagal menandai dibaca:", error);
      }
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.readAllNotifications();
      set((state) => ({
        notifications: (state.notifications || []).map((n) => ({
          ...n,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Gagal menandai semua dibaca:", error);
    }
  },
}));
