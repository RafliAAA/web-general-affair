import { useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom"; // Import useLocation
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Ambil info URL saat ini

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Fungsi untuk menentukan judul berdasarkan URL
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/aset-perusahaan")) return "Aset Perusahaan";
    if (pathname.startsWith("/notifikasi")) return "Notifikasi";
    if (pathname.startsWith("/aset=saya")) return "Aset Saya";
    if (pathname.startsWith("/peminjaman")) return "Peminjaman Aset";
    if (pathname.startsWith("/serah-terima")) return "Serah Terima";
    if (pathname.startsWith("/pemeliharaan")) return "Pemeliharaan";
    if (pathname.startsWith("/pengadaan")) return "Pengadaan";
    if (pathname.startsWith("/pengembalian")) return "Pengembalian";
    if (pathname.startsWith("/perbaikan")) return "Perbaikan";
    if (pathname.startsWith("/lapor-kerusakan")) return "Lapor Kerusakan";
    if (pathname.startsWith("/penghapusan")) return "Penghapusan";
    if (pathname.startsWith("/pengajuan")) return "Pengajuan";
    if (pathname.startsWith("/aset-saya")) return "Aset Saya";
    if (pathname.startsWith("/management-users")) return "Manajemen User";
    if (pathname.startsWith("/profile")) return "Profile";
    // Tambahkan kondisi lain sesuai route kamu
    return "Dashboard"; // Default judul
  };

  // Gunakan useMemo agar tidak hitung ulang terus menerus
  const title = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Kirim title yang sudah didapat ke Header */}
        <Header title={title} toggleSidebar={toggleSidebar} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;