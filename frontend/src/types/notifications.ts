export interface NotificationItem {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  createdAt: string;
}
