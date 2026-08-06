import prisma from "../../config/prisma";
import { HandoverStatus, AssetStatus } from "@prisma/client";
import type { CreateHandoverDTO, ReturnHandoverDTO } from "./handover.dto";

const createHandover = async (data: CreateHandoverDTO, created_by: string) => {
  return await prisma.$transaction(async (tx) => {
    for (const item of data.items) {
      const asset = await tx.asset.findUnique({
        where: { asset_id: item.asset_id },
      });

      if (!asset) throw new Error(`Asset ${item.asset_id} not found`);
      if (asset.status !== AssetStatus.Tersedia) {
        throw new Error(`Asset ${asset.asset_name} is not available`);
      }

      const activeHandover = await tx.handoverItem.findFirst({
        where: {
          asset_id: item.asset_id,
          handover: { status: HandoverStatus.Aktif },
        },
      });

      if (activeHandover) {
        throw new Error(
          `Asset ${asset.asset_name} already has an active handover`,
        );
      }
    }

    const handover = await tx.handover.create({
      data: {
        user_id: data.user_id,
        created_by,
        handover_date: data.handover_date,
        entity_id: data.entity_id,
        directorate_id: data.directorate_id,
        // TAMBAHKAN INI
        recipient_type: data.recipient_type || "Personal",
        items: {
          create: data.items.map((item) => ({
            asset_id: item.asset_id,
            notes: item.notes ?? null,
          })),
        },
      },
      include: {
        items: { include: { asset: true } },
        receiver: { select: { profile: { select: { name: true } } } },
        creator: { select: { profile: { select: { name: true } } } },
        entity: true,
        directorate: true,
      },
    });

    await tx.asset.updateMany({
      where: {
        asset_id: { in: data.items.map((item) => item.asset_id) },
      },
      data: {
        status: AssetStatus.Diserahkan,
      },
    });

    return handover;
  });
};

const getAllHandover = async () => {
  return await prisma.handover.findMany({
    include: {
      items: {
        include: {
          asset: {
            select: {
              asset_name: true,
              asset_code: true,
              asset_category: {
                select: {
                  category_name: true,
                },
              },
            },
          },
        },
      },
      receiver: { select: { profile: { select: { name: true } } } },
      creator: { select: { profile: { select: { name: true } } } },
      entity: true,
      directorate: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getHandoverById = async (handover_id: string) => {
  return await prisma.handover.findUnique({
    where: { handover_id },
    include: {
      items: {
        include: {
          asset: {
            select: {
              asset_name: true,
              asset_code: true,
              serial_number: true,
              condition: true,
              asset_category: {
                select: {
                  category_name: true,
                },
              },
            },
          },
        },
      },
      receiver: { select: { profile: { select: { name: true } } } },
      creator: { select: { profile: { select: { name: true } } } },
      returner: { select: { profile: { select: { name: true } } } },
      entity: true,
      directorate: true,
    },
  });
};

const getHandoverByUser = async (user_id: string) => {
  return await prisma.handover.findMany({
    where: { user_id },
    include: {
      items: {
        include: {
          asset: {
            select: {
              asset_name: true,
              asset_code: true,
              condition: true,
            },
          },
        },
      },
      entity: true,
      directorate: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const returnHandover = async (
  handover_id: string,
  returned_by: string,
  data: ReturnHandoverDTO,
) => {
  return await prisma.$transaction(async (tx) => {
    const handover = await tx.handover.findUnique({
      where: { handover_id },
      include: { items: true },
    });

    if (!handover) throw new Error("Handover not found");

    if (handover.status !== HandoverStatus.Aktif) {
      throw new Error("Handover is already returned");
    }

    const updated = await tx.handover.update({
      where: { handover_id },
      data: {
        status: HandoverStatus.Dikembalikan,
        returned_at: new Date(),
        returned_by,
        return_notes: data.return_notes ?? null,
      },
    });

    await tx.asset.updateMany({
      where: {
        asset_id: {
          in: handover.items.map((item) => item.asset_id),
        },
      },
      data: {
        status: AssetStatus.Tersedia,
      },
    });

    return updated;
  });
};

export default {
  createHandover,
  getAllHandover,
  getHandoverById,
  getHandoverByUser,
  returnHandover,
};
