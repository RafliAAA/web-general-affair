import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoSyaamil from "../../assets/LogoSyaamil.png";
import {
  Calendar,
  Car,
  FilePen,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Aset Perusahaan", href: "/aset-perusahaan", icon: Package },
  { name: "Aset Karyawan", href: "/aset-karyawan", icon: Users },
  { name: "Ruangan", href: "/ruangan", icon: Calendar },
  { name: "Kendaraan", href: "/kendaraan", icon: Car },
  { name: "SOP GA", href: "/sop", icon: FileText },
  { name: "Form Pengajuan", href: "/pengajuan", icon: FilePen },
];

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-40 h-screen w-64 border-r border-slate-300 bg-white transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0" // sidebar selalu tampil di desktop
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-3 text-2xl border-b border-slate-300 flex items-center">
            <img className="h-10 object-contain" src={LogoSyaamil} alt="Logo" />
          </div>

          {/* Navigasi */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={closeSidebar} // tutup sidebar setelah klik di mobile
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
              onClick={closeSidebar}
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
