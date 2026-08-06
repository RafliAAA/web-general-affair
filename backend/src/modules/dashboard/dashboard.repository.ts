import prisma from "../../config/prisma";
import { BorrowStatus, MaintenanceStatus } from "@prisma/client";

const getAdminDashboard = async () => {
  const [
    // Aset per status
    totalTersedia,
    totalDipinjam,
    totalDiperbaiki,
    totalDiserahkan,
    totalDihapus,

    // Peminjaman per status
    totalBorrowMenunggu,
    totalBorrowDisetujui,
    totalBorrowDitolak,
    totalBorrowDibatalkan,
    totalBorrowDikembalikan,

    // Maintenance per status
    totalMaintenanceMenungguVerifikasi,
    totalMaintenanceMenungguDikerjakan,
    totalMaintenanceSedangDikerjakan,
    totalMaintenanceSelesai,
    totalMaintenanceDitolak,
    totalMaintenanceTidakDapatDiperbaiki,

    // Lainnya
    totalProcurement,
    totalDisposal,
    totalHandoverAktif,

    // Recent activity
    recentBorrows,
    recentMaintenance,
  ] = await Promise.all([
    // Aset
    prisma.asset.count({ where: { status: "Tersedia" } }),
    prisma.asset.count({ where: { status: "Dipinjam" } }),
    prisma.asset.count({ where: { status: "Diperbaiki" } }),
    prisma.asset.count({ where: { status: "Diserahkan" } }),
    prisma.asset.count({ where: { status: "Dihapus" } }),

    // Peminjaman
    prisma.borrow.count({ where: { status: BorrowStatus.Menunggu } }),
    prisma.borrow.count({ where: { status: BorrowStatus.Disetujui } }),
    prisma.borrow.count({ where: { status: BorrowStatus.Ditolak } }),
    prisma.borrow.count({ where: { status: BorrowStatus.Dibatalkan } }),
    prisma.borrow.count({ where: { status: BorrowStatus.Dikembalikan } }),

    // Maintenance
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.MenungguVerifikasi },
    }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.MenungguDikerjakan },
    }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.SedangDikerjakan },
    }),
    prisma.maintenance.count({ where: { status: MaintenanceStatus.Selesai } }),
    prisma.maintenance.count({ where: { status: MaintenanceStatus.Ditolak } }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.TidakDapatDiperbaiki },
    }),

    // Lainnya
    prisma.procurement.count(),
    prisma.disposal.count(),
    prisma.handover.count({ where: { status: "Aktif" } }),

    // Recent activity
    prisma.borrow.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { asset_name: true, asset_code: true } },
        user: { select: { profile: { select: { name: true } } } },
      },
    }),
    prisma.maintenance.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { asset_name: true, asset_code: true } },
        reporter: { select: { profile: { select: { name: true } } } },
      },
    }),
  ]);

  return {
    assets: {
      tersedia: totalTersedia,
      dipinjam: totalDipinjam,
      diperbaiki: totalDiperbaiki,
      dihapus: totalDihapus,
      diserahkan: totalDiserahkan,
      total:
        totalTersedia +
        totalDipinjam +
        totalDiperbaiki +
        totalDihapus +
        totalDiserahkan,
    },
    borrows: {
      menunggu: totalBorrowMenunggu,
      disetujui: totalBorrowDisetujui,
      ditolak: totalBorrowDitolak,
      dikembalikan: totalBorrowDikembalikan,
      total:
        totalBorrowMenunggu +
        totalBorrowDisetujui +
        totalBorrowDitolak +
        totalBorrowDikembalikan,
    },
    maintenance: {
      menungguVerifikasi: totalMaintenanceMenungguVerifikasi,
      menungguDikerjakan: totalMaintenanceMenungguDikerjakan,
      sedangDikerjakan: totalMaintenanceSedangDikerjakan,
      selesai: totalMaintenanceSelesai,
      ditolak: totalMaintenanceDitolak,
      tidakDapatDiperbaiki: totalMaintenanceTidakDapatDiperbaiki,
      total:
        totalMaintenanceMenungguVerifikasi +
        totalMaintenanceMenungguDikerjakan +
        totalMaintenanceSedangDikerjakan +
        totalMaintenanceSelesai +
        totalMaintenanceDitolak +
        totalMaintenanceTidakDapatDiperbaiki,
    },
    procurement: { total: totalProcurement },
    disposal: { total: totalDisposal },
    handover: { aktif: totalHandoverAktif },
    recentActivity: {
      borrows: recentBorrows,
      maintenance: recentMaintenance,
    },
  };
};

const getUserDashboard = async (user_id: string) => {
  const [
    // 1. Aset yang diserahkan ke user ini dan masih aktif
    totalAsetSayaAktif,

    // 2. Peminjaman yang diajukan oleh user ini
    totalBorrowMenunggu,
    totalBorrowDisetujui,
    totalBorrowDikembalikan,

    // 3. Laporan kerusakan yang dilaporkan oleh user ini
    totalMaintenanceProses,
    totalMaintenanceSelesai,

    // 4. Recent Activity (5 terbaru)
    recentMyBorrows,
    recentMyMaintenance,
    recentMyHandovers,
  ] = await Promise.all([
    // Aset Saya (Handover Aktif)
    prisma.handover.count({
      where: { user_id, status: "Aktif" },
    }),

    // Peminjaman Saya
    prisma.borrow.count({
      where: { user_id, status: BorrowStatus.Menunggu },
    }),
    prisma.borrow.count({
      where: { user_id, status: BorrowStatus.Disetujui },
    }),
    prisma.borrow.count({
      where: { user_id, status: BorrowStatus.Dikembalikan },
    }),

    // Maintenance Saya
    prisma.maintenance.count({
      where: {
        reported_by: user_id,
        status: {
          in: [
            MaintenanceStatus.MenungguVerifikasi,
            MaintenanceStatus.MenungguDikerjakan,
            MaintenanceStatus.SedangDikerjakan,
          ],
        },
      },
    }),
    prisma.maintenance.count({
      where: { reported_by: user_id, status: MaintenanceStatus.Selesai },
    }),

    // Recent Borrows
    prisma.borrow.findMany({
      where: { user_id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { asset_name: true, asset_code: true } },
      },
    }),

    // Recent Maintenance
    prisma.maintenance.findMany({
      where: { reported_by: user_id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { asset_name: true, asset_code: true } },
      },
    }),

    // Recent Handovers (Aset yang diserahkan ke dia)
    prisma.handover.findMany({
      where: { user_id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            asset: { select: { asset_name: true, asset_code: true } },
          },
        },
      },
    }),
  ]);

  return {
    myAssets: {
      aktif: totalAsetSayaAktif,
    },
    myBorrows: {
      menunggu: totalBorrowMenunggu,
      disetujui: totalBorrowDisetujui,
      dikembalikan: totalBorrowDikembalikan,
      total:
        totalBorrowMenunggu + totalBorrowDisetujui + totalBorrowDikembalikan,
    },
    myMaintenance: {
      proses: totalMaintenanceProses,
      selesai: totalMaintenanceSelesai,
      total: totalMaintenanceProses + totalMaintenanceSelesai,
    },
    recentActivity: {
      borrows: recentMyBorrows,
      maintenance: recentMyMaintenance,
      handovers: recentMyHandovers,
    },
  };
};

const getITDashboard = async () => {
  const [
    totalMenungguVerifikasi,
    totalMenungguDikerjakan,
    totalSedangDikerjakan,
    totalSelesai,
    totalTidakDapatDiperbaiki,
    recentMaintenance,
    monthlyMaintenanceRaw, // <--- TAMBAHKAN INI UNTUK MENAMPUNG QUERY RAW
  ] = await Promise.all([
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.MenungguVerifikasi },
    }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.MenungguDikerjakan },
    }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.SedangDikerjakan },
    }),
    prisma.maintenance.count({ where: { status: MaintenanceStatus.Selesai } }),
    prisma.maintenance.count({
      where: { status: MaintenanceStatus.TidakDapatDiperbaiki },
    }),

    // Ambil 5 laporan terbaru yang butuh aksi IT (Menunggu Dikerjakan / Sedang Dikerjakan)
    prisma.maintenance.findMany({
      where: {
        status: {
          in: [
            MaintenanceStatus.MenungguDikerjakan,
            MaintenanceStatus.SedangDikerjakan,
          ],
        },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { asset_name: true, asset_code: true } },
        reporter: { select: { profile: { select: { name: true } } } },
      },
    }),

    prisma.$queryRaw`
      SELECT 
        MONTH(createdAt) as month, 
        CAST(COUNT(*) AS SIGNED) as count 
      FROM Maintenance 
      WHERE YEAR(createdAt) = YEAR(CURDATE())
      GROUP BY MONTH(createdAt)
      ORDER BY month ASC
    `,
  ]);

   return {
    maintenance: {
      menungguVerifikasi: totalMenungguVerifikasi,
      menungguDikerjakan: totalMenungguDikerjakan,
      sedangDikerjakan: totalSedangDikerjakan,
      selesai: totalSelesai,
      tidakDapatDiperbaiki: totalTidakDapatDiperbaiki,
      total:
        totalMenungguVerifikasi +
        totalMenungguDikerjakan +
        totalSedangDikerjakan +
        totalSelesai +
        totalTidakDapatDiperbaiki,
    },
    recentActivity: {
      maintenance: recentMaintenance,
    },
    // PERBAIKAN ADA DI BAGIAN INI:
    monthlyTrend: (monthlyMaintenanceRaw as any[]).map((item) => ({
      month: new Date(0, Number(item.month) - 1).toLocaleString('id-ID', { month: 'short' }),
      count: Number(item.count)
    }))
  };
};

// Jangan lupa daftarkan di export default
export default {
  getAdminDashboard,
  getUserDashboard,
  getITDashboard,
};