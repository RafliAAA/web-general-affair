import prisma from "../../config/prisma";
import {
  MaintenanceStatus,
  AssetStatus,
  BorrowStatus,
  HandoverStatus,
} from "@prisma/client";
import type {
  CreateMaintenanceDTO,
  VerifyMaintenanceDTO,
  RejectMaintenanceDTO,
  TakeMaintenanceDTO,
  CompleteMaintenanceDTO,
  CannotRepairDTO,
} from "./maintenance.dto";
import { generateActualizationFormNumber } from "../../helper/generate.code";

const createMaintenance = async (data: CreateMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { asset_id: data.asset_id },
    });

    if (!asset) throw new Error("Asset not found");

    const activeBorrow = await tx.borrow.findFirst({
      where: {
        asset_id: data.asset_id,
        user_id: data.reported_by,
        status: BorrowStatus.Disetujui,
      },
    });

   const activeHandover = await tx.handover.findFirst({
  where: {
    user_id: data.reported_by,
    status: HandoverStatus.Aktif,
    items: {
      some: {
        asset_id: data.asset_id,
      },
    },
  },
});
const hasOwnership = !!activeBorrow || !!activeHandover;
    if (!hasOwnership) {
      throw new Error("You can only report assets currently assigned to you");
    }

    const existingActive = await tx.maintenance.findFirst({
      where: {
        asset_id: data.asset_id,
        status: {
          in: [
            MaintenanceStatus.MenungguVerifikasi,
            MaintenanceStatus.MenungguDikerjakan,
            MaintenanceStatus.SedangDikerjakan,
          ],
        },
      },
    });

    if (existingActive) {
      throw new Error("Asset already has an active maintenance report");
    }

    const maintenance = await tx.maintenance.create({
      data: {
        asset_id: data.asset_id,
        reported_by: data.reported_by,
        description: data.description,
        source: data.source,
      },
      include: {
        asset: true,
        reporter: {
          select: {
            user_id: true,
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
        verifier: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        handler: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });

    await tx.asset.update({
      where: { asset_id: data.asset_id },
      data: { status: AssetStatus.Diperbaiki },
    });

    return maintenance;
  });
};

const getAllMaintenance = async () => {
  return await prisma.maintenance.findMany({
    include: {
      asset: {
        include: {
          asset_category: true,
        },
      },
      reporter: {
        select: {
          user_id: true,
          email: true,
          profile: { select: { name: true } },
        },
      },
      verifier: {
        select: {
          user_id: true,
          email: true,
          profile: { select: { name: true } },
        },
      },
      handler: {
        select: {
          user_id: true,
          email: true,
          profile: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const userSelect = {
  user_id: true,
  email: true,
  profile: {
    select: { name: true },
  },
};

const getMaintenanceById = async (maintenance_id: string) => {
  return await prisma.maintenance.findUnique({
    where: { maintenance_id },
    include: {
      asset: {
        include: {
          asset_category: true, 
        },
      },
      reporter: { select: userSelect },
      verifier: { select: userSelect },
      handler: { select: userSelect },
    },
  });
};

const getMyMaintenance = async (user_id: string) => {
  return await prisma.maintenance.findMany({
    where: { reported_by: user_id },
    include: {
      asset: {
        select: {
          asset_id: true,
          asset_name: true,
          asset_code: true,
          asset_category: true,
        },
      },
      reporter: { select: userSelect },
      verifier: { select: userSelect },
      handler: { select: userSelect },
    },
    orderBy: { createdAt: "desc" },
  });
};

const verifyMaintenance = async (data: VerifyMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { maintenance_id: data.maintenance_id },
    });

    if (!maintenance) throw new Error("Maintenance not found");

    if (maintenance.status !== MaintenanceStatus.MenungguVerifikasi) {
      throw new Error("Maintenance is not in pending verification status");
    }

    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.MenungguDikerjakan,
        verified_by: data.verified_by,
        verified_at: new Date(),
      },
      include: {
        asset: {
          select: {
            asset_id: true,
            asset_name: true,
            asset_code: true,
            asset_category: true,
          },
        },
        reporter: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        verifier: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        handler: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });
  });
};

const takeMaintenance = async (data: TakeMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { maintenance_id: data.maintenance_id },
    });

    if (!maintenance) throw new Error("Maintenance not found");

    if (maintenance.status !== MaintenanceStatus.MenungguDikerjakan) {
      throw new Error("Maintenance is not in pending work status");
    }

    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.SedangDikerjakan,
        taken_by: data.taken_by,
        taken_at: new Date(),
      },
      include: {
        asset: {
          select: {
            asset_id: true,
            asset_name: true,
            asset_code: true,
            asset_category: true,
          },
        },
        reporter: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        verifier: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        handler: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });
  });
};

const completeMaintenance = async (data: CompleteMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { maintenance_id: data.maintenance_id },
    });

    if (!maintenance) throw new Error("Maintenance not found");

    if (maintenance.status !== MaintenanceStatus.SedangDikerjakan) {
      throw new Error("Maintenance is not in progress");
    }

    const activeBorrow = await tx.borrow.findFirst({
      where: { asset_id: maintenance.asset_id, status: BorrowStatus.Disetujui },
    });
    const activeHandover = await tx.handover.findFirst({
      where: {
        status: HandoverStatus.Aktif,
        items: { some: { asset_id: maintenance.asset_id } },
      },
    });

    const returnStatus = activeBorrow
      ? AssetStatus.Dipinjam
      : activeHandover
        ? AssetStatus.Diserahkan
        : AssetStatus.Tersedia;

    // UBAH DI SINI: Kondisi kembali jadi "Baik"
    await tx.asset.update({
      where: { asset_id: maintenance.asset_id },
      data: {
        status: returnStatus,
        condition: "Baik",
      },
    });

    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.Selesai,
        resolution_notes: data.resolution_notes,
        completed_at: new Date(),
      },
      include: {
        asset: true,
        reporter: { select: { profile: { select: { name: true } } } },
        verifier: { select: { profile: { select: { name: true } } } },
        handler: { select: { profile: { select: { name: true } } } },
      },
    });
  });
};

const cannotRepair = async (data: CannotRepairDTO) => {
  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { maintenance_id: data.maintenance_id },
    });

    if (!maintenance) throw new Error("Maintenance not found");

    if (maintenance.status !== MaintenanceStatus.SedangDikerjakan) {
      throw new Error("Maintenance is not in progress");
    }

    const profile = await tx.profile.findUnique({
      where: { user_id: maintenance.taken_by! },
    });

    const now = new Date();
    const takenAt = maintenance.taken_at ?? now;
    const duration_minutes = Math.round(
      (now.getTime() - takenAt.getTime()) / 60000,
    );

     const generatedFormNumber = await generateActualizationFormNumber(tx);

    await tx.actualizationForm.create({
      data: {
        maintenance_id: data.maintenance_id,
        form_number: generatedFormNumber,
        user_name: profile?.name ?? "IT",
        form_date: now,
        duration_minutes,
        description: data.description,
        issue: data.issue,
        handling: data.handling,
        recommendation: data.recommendation,
      },
    });

    await tx.asset.update({
      where: { asset_id: maintenance.asset_id },
      data: {
        status: AssetStatus.Diperbaiki,
        condition: "Rusak",
      },
    });

    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.TidakDapatDiperbaiki,
      },
      include: {
        asset: true,
        reporter: { select: { profile: { select: { name: true } } } },
        verifier: { select: { profile: { select: { name: true } } } },
        handler: { select: { profile: { select: { name: true } } } },
      },
    });
  });
};

// DTO-nya bisa pakai CompleteMaintenanceDTO yang sama
const completeMaintenanceExternal = async (data: CompleteMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const maintenance = await tx.maintenance.findUnique({
      where: { maintenance_id: data.maintenance_id },
      include: {
        asset: {
          include: {
            asset_category: true, 
          },
        },
      },
    });

    if (!maintenance) throw new Error("Maintenance not found");

    // Cek apakah aset ini kendaraan
    const isKendaraan = maintenance.asset.asset_category?.category_name === "Kendaraan";

    // Tombol ini hanya bisa dipanggil kalau:
    // 1. Aset Kendaraan & SedangDikerjakan (Berarti mobil lagi di bengkel)
    // 2. Aset Bukan Kendaraan & TidakDapatDiperbaiki (Berarti elektronik yang dikirim ke vendor)
    const isAllowed = 
      (isKendaraan && maintenance.status === MaintenanceStatus.SedangDikerjakan) || 
      (!isKendaraan && maintenance.status === MaintenanceStatus.TidakDapatDiperbaiki);

    if (!isAllowed) {
      throw new Error("This maintenance is not waiting for external repair");
    }

    // Cek kepemilikan aset
    const activeBorrow = await tx.borrow.findFirst({
      where: { asset_id: maintenance.asset_id, status: BorrowStatus.Disetujui },
    });
    const activeHandover = await tx.handover.findFirst({
      where: {
        status: HandoverStatus.Aktif,
        items: { some: { asset_id: maintenance.asset_id } },
      },
    });

    const returnStatus = activeBorrow
      ? AssetStatus.Dipinjam
      : activeHandover
        ? AssetStatus.Diserahkan
        : AssetStatus.Tersedia;

    // Update Aset: Kembali ke pemilik, kondisi Baik
    await tx.asset.update({
      where: { asset_id: maintenance.asset_id },
      data: { 
        status: returnStatus,
        condition: "Baik"
      },
    });

    // Update Maintenance: Selesai
    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.Selesai,
        resolution_notes: data.resolution_notes,
        completed_at: new Date(),
      },
      include: {
        asset: {
          include: {
            asset_category: true, // Include kategori agar frontend dapat datanya
          },
        },
        reporter: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        verifier: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        handler: {
          select: {
            user_id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });
  });
};

const getActualizationForm = async (maintenance_id: string) => {
  return await prisma.actualizationForm.findUnique({
    where: { maintenance_id },
  });
};

export default {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  getMyMaintenance,
  verifyMaintenance,
  takeMaintenance,
  completeMaintenance,
  completeMaintenanceExternal,
  cannotRepair,
  getActualizationForm,
};
