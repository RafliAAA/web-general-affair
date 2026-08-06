import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  LogOut,
  CheckCheck,
} from "lucide-react";
import LogoSyaamil from "../../assets/LogoSyaamil.png";
import { Button } from "../ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { useNotificationStore } from "../../features/notifications/hooks/useNotificationsStore";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { NotificationItem } from "@/types/notifications";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header = ({ toggleSidebar, title }: HeaderProps) => {
  const { user, logout } = useAuthStore();
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
    <header className="sticky top-0 z-30 flex items-center border-b bg-primary-foreground px-4 sm:px-6 h-16">
      <div className="flex items-center justify-between w-full h-10">
        {/* KIRI: Tombol Menu & Judul */}
        <div className="flex items-center gap-3">
          {/* HAPUS lg:hidden DI SINI agar tombol muncul di desktop juga */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>

        {/* KANAN: Notif & Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* POPUP NOTIFIKASI */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[7px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border shadow-lg" align="end">
              {/* Header Notif */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Notifikasi</h3>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto py-1 px-2 text-blue-600 hover:text-blue-700"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                    Tandai dibaca
                  </Button>
                )}
              </div>

              {/* List Notif */}
              <ScrollArea className="h-80">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                    <Bell className="h-8 w-8 text-gray-300" />
                    <span>Tidak ada notifikasi</span>
                  </div>
                ) : (
                  <div className="flex flex-col p-2 gap-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.notification_id}
                        onClick={() => handleClickNotif(notif)}
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          !notif.is_read ? "bg-blue-50 dark:bg-blue-950/40" : ""
                        }`}
                      >
                        <div className="mt-1.5 relative flex-shrink-0">
                          {!notif.is_read ? (
                            <span className="block h-2.5 w-2.5 rounded-full bg-blue-500" />
                          ) : (
                            <span className="block h-2.5 w-2.5 rounded-full border border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-gray-400 pt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer Notif */}
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/notifikasi")}
                >
                  Lihat Semua Notifikasi
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Dropdown User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1 h-auto rounded-full hover:bg-muted"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  src={user?.profile?.photo || LogoSyaamil}
                  alt="Foto Profil"
                />
                <div className="hidden sm:flex items-center gap-1.5 pr-1">
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-medium">
                      {user?.profile?.name || "User"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.profile?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;