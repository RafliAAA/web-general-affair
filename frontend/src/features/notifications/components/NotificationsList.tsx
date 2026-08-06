import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useNotificationStore,
} from "../hooks/useNotificationsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Bell } from "lucide-react";
import type { NotificationItem } from "@/types/notifications";

export default function NotificationList() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClickNotif = (notif: NotificationItem) => {
    storeMarkAsRead(notif.notification_id, notif.is_read);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Semua Notifikasi</h1>
          <p className="text-sm text-gray-500">
            Kamu punya {unreadCount} notifikasi yang belum dibaca
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Bell className="w-10 h-10 mb-3 text-gray-400" />
              <p>Tidak ada notifikasi saat ini</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.notification_id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${!notif.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""}`}
              onClick={() => handleClickNotif(notif)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    {notif.title}
                  </CardTitle>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{notif.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
