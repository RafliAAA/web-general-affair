// maintenance.repository.ts
import prisma from "../../config/prisma";
import { MaintenanceStatus, AssetStatus, BorrowStatus } from "@prisma/client";
import type {
  CreateMaintenanceDTO,
  VerifyMaintenanceDTO,
  RejectMaintenanceDTO,
  TakeMaintenanceDTO,
  CompleteMaintenanceDTO,
  CannotRepairDTO,
} from "./maintenance.dto";

const createMaintenance = async (data: CreateMaintenanceDTO) => {
  return await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { asset_id: data.asset_id },
    });

    if (!asset) throw new Error("Asset not found");

    // Cek peminjaman aktif
    const activeBorrow = await tx.borrow.findFirst({
      where: {
        asset_id: data.asset_id,
        user_id: data.reported_by,
        status: BorrowStatus.Disetujui,
      },
    });

    // TODO: cek dari serah terima aktif setelah model Handover dibuat
    // const activeHandover = await tx.handover.findFirst({
    //   where: {
    //     asset_id: data.asset_id,
    //     user_id: data.reported_by,
    //     status: HandoverStatus.Aktif,
    //   },
    // });

    const hasOwnership = !!activeBorrow; // nanti jadi: !!activeBorrow || !!activeHandover

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
      asset: true,
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
      asset: true,
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
      asset: true,
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
        asset: true,
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
        asset: true,
        reporter: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
        verifier: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
        handler: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
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

    await tx.asset.update({
      where: { asset_id: maintenance.asset_id },
      data: { status: AssetStatus.Dipinjam },
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
    const duration_minutes = Math.round((now.getTime() - takenAt.getTime()) / 60000);

    await tx.actualizationForm.create({
      data: {
        maintenance_id: data.maintenance_id,
        form_number: data.form_number,
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
        status: AssetStatus.Dipinjam,
        condition: "Rusak",
      },
    });

    return await tx.maintenance.update({
      where: { maintenance_id: data.maintenance_id },
      data: {
        status: MaintenanceStatus.TidakDapatDiperbaiki,
        completed_at: now,
      },
      include: {
        asset: true,
        reporter: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
        verifier: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
        handler: { select: { user_id: true, email: true, profile: { select: { name: true } } } },
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
  cannotRepair,
  getActualizationForm,
};
