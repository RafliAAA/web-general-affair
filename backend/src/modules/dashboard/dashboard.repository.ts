import prisma from "../../config/prisma";
import { BorrowStatus, MaintenanceStatus } from "@prisma/client";

const getAdminDashboard = async () => {
  const [
    // Aset per status
    totalTersedia,
    totalDipinjam,
    totalDiperbaiki,

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
      total: totalTersedia + totalDipinjam + totalDiperbaiki,
    },
    borrows: {
      menunggu: totalBorrowMenunggu,
      disetujui: totalBorrowDisetujui,
      ditolak: totalBorrowDitolak,
      dibatalkan: totalBorrowDibatalkan,
      dikembalikan: totalBorrowDikembalikan,
      total:
        totalBorrowMenunggu +
        totalBorrowDisetujui +
        totalBorrowDitolak +
        totalBorrowDibatalkan +
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

export default { getAdminDashboard };
