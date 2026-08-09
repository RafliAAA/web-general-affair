import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoSyaamil from "../../assets/LogoSyaamil.png";
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  ShoppingCart,
  ClipboardCheck,
  ArrowRightLeft,
  Wrench,
  TriangleAlert,
  FileWarning,
  Trash2,
  FilePen,
  Settings,
  User,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  roles?: string[]; 
  children?: { name: string; href: string; roles?: string[] }[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN", "IT", "USER"],
  },

  {
    name: "Manajemen Aset",
    icon: Package,
    roles: ["ADMIN"],
    children: [
      {
        name: "Aset Perusahaan",
        href: "/aset-perusahaan",
        roles: ["ADMIN"],
      },
      { name: "Kategori Aset", href: "/kategori-aset", roles: ["ADMIN"] },
    ],
  },

  {
    name: "Pengadaan",
    href: "/pengadaan",
    icon: ShoppingCart,
    roles: ["ADMIN"],
  },
  {
    name: "Serah Terima",
    href: "/serah-terima",
    icon: ClipboardCheck,
    roles: ["ADMIN"],
  },
  {
    name: "Peminjaman",
    href: "/peminjaman",
    icon: ArrowRightLeft,
    roles: ["ADMIN"],
  },
  {
    name: "Pemeliharaan",
    href: "/pemeliharaan",
    icon: Wrench,
    roles: ["ADMIN"],
  },
  { name: "Penghapusan", href: "/penghapusan", icon: Trash2, roles: ["ADMIN"] },

  {
    name: "Laporan Kerusakan",
    href: "/perbaikan",
    icon: TriangleAlert,
    roles: ["IT"],
  },

  {
    name: "Lapor Kerusakan",
    href: "/lapor-kerusakan",
    icon: FileWarning,
    roles: ["USER"],
  },
  {
    name: "Pengajuan Aset",
    href: "/pengajuan",
    icon: FilePen,
    roles: ["USER"],
  },
  { name: "Aset Saya", href: "/aset-saya", icon: Package, roles: ["USER"] },

  {
    name: "Manajemen User",
    icon: User,
    roles: ["ADMIN"],
    children: [
      { name: "Data Karyawan", href: "/management-users", roles: ["ADMIN"] },
      { name: "Data Entitas", href: "/entity", roles: ["ADMIN"] },
      { name: "Data Direktorat", href: "/directorate", roles: ["ADMIN"] },
    ],
  },
];

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore(); 

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Manajemen Aset": true,
    "Manajemen User": true,
  });

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true; 
    return item.roles.includes(user?.role || "");
  });

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen lg:sticky bg-white transition-all duration-300 overflow-hidden",
          isOpen
            ? "w-64 border-r border-slate-300 translate-x-0"
            : "w-0 -translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full w-64 min-w-[256px]">
          {/* Logo */}
          <div className="px-6 text-2xl border-b border-border h-16 flex items-center">
            <img className="h-10 object-contain" src={LogoSyaamil} alt="Logo" />
          </div>

          {/* Navigasi */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              if (item.children) {
                // Filter children juga berdasarkan role
                const filteredChildren = item.children.filter((child) => {
                  if (!child.roles) return true;
                  return child.roles.includes(user?.role || "");
                });

                // Kalau gak ada child yang bisa diakses, skip parent-nya
                if (filteredChildren.length === 0) return null;

                const isChildActive = filteredChildren.some((child) =>
                  location.pathname.startsWith(child.href),
                );

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                        isChildActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMenus[item.name] && "rotate-180",
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        openMenus[item.name]
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                          {filteredChildren.map((child) => {
                            const isActive = location.pathname.startsWith(
                              child.href,
                            );
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                  isActive
                                    ? "text-sidebar-primary font-semibold"
                                    : "text-slate-600 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                )}
                                onClick={handleLinkClick}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href || "");

              return (
                <Link
                  key={item.name}
                  to={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={handleLinkClick}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <Link
              to="/pengaturan"
              className="flex items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLinkClick}
            >
              <Settings className="w-5 h-5" />
              Pengaturan
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
