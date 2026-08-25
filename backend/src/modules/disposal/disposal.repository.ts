import { AssetStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AddDisposalItemsInput, CreateDisposalInput, UpdateDisposalHeaderInput } from "./disposal.dto";
import { generateMemoNumber } from "../../helper/generate.code";

const createDisposal = async (data: CreateDisposalInput) => {
  return prisma.$transaction(async (tx) => {
    const memo_number = await generateMemoNumber(tx)

    const disposal = await tx.disposal.create({
      data: {
        memo_number,
        memo_date: data.memo_date,
        subject: data.subject,
        from: data.from,
        to: data.to,
        cc: data.cc,
        description: data.description,
      },
    });

    await tx.disposalItem.createMany({
      data: data.items.map((item) => ({
        disposal_id: disposal.disposal_id,
        asset_id: item.asset_id,
        method: item.method,
        notes: item.notes,
        recipient_name: item.recipient_name ? item.recipient_name : null
      })),
    });

    await tx.asset.updateMany({
      where: {
        asset_id: {
          in: data.items.map((item) => item.asset_id),
        },
      },
      data: {
        deletedAt: new Date(),
        status: AssetStatus.Dihapus,
      },
    });

    return await tx.disposal.findUnique({
      where: {
        disposal_id: disposal.disposal_id,
      },
      include: {
        items: {
          include: {
            asset: true,
          },
        },
      },
    });
  });
};

const getAllDisposals = async () => {
  return prisma.disposal.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDisposalById = async (disposal_id: string) => {
  return prisma.disposal.findUnique({
    where: {
      disposal_id,
    },
    include: {
      items: {
        include: {
          asset: {
            include: {
              asset_category: true,
            },
          },
        },
      },
    },
  });
};

const updateDisposal = async (
  disposal_id: string,
  data: CreateDisposalInput,
) => {
  return prisma.$transaction(async (tx) => {
    const existingDisposal = await tx.disposal.findUnique({
      where: {
        disposal_id,
      },
      include: {
        items: true,
      },
    });

    if (!existingDisposal) {
      throw new Error("Disposal not found");
    }

    // restore asset lama
    await tx.asset.updateMany({
      where: {
        asset_id: {
          in: existingDisposal.items.map((item) => item.asset_id),
        },
      },
      data: {
        deletedAt: null,
        status: AssetStatus.Dihapus,
      },
    });

    // hapus item lama
    await tx.disposalItem.deleteMany({
      where: {
        disposal_id,
      },
    });

    // update header
    await tx.disposal.update({
      where: {
        disposal_id,
      },
      data: {
        memo_date: data.memo_date,
        subject: data.subject,
        from: data.from,
        to: data.to,
        cc: data.cc,
        description: data.description,
      },
    });

    // buat item baru
    await tx.disposalItem.createMany({
      data: data.items.map((item) => ({
        disposal_id: disposal_id,
        asset_id: item.asset_id,
        method: item.method,
        notes: item.notes,
        recipient_name: item.recipient_name ? item.recipient_name : null
      })),
    });

    // soft delete asset baru
    await tx.asset.updateMany({
      where: {
        asset_id: {
          in: data.items.map((item) => item.asset_id),
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return tx.disposal.findUnique({
      where: {
        disposal_id,
      },
      include: {
        items: {
          include: {
            asset: {
              include: {
                asset_category: true,
              },
            },
          },
        },
      },
    });
  });
};

const deleteDisposal = async (disposal_id: string) => {
  return prisma.$transaction(async (tx) => {
    const disposal = await tx.disposal.findUnique({
      where: {
        disposal_id,
      },
      include: {
        items: true,
      },
    });

    if (!disposal) {
      throw new Error("Disposal not found");
    }

    // aktifkan kembali asset
    await tx.asset.updateMany({
      where: {
        asset_id: {
          in: disposal.items.map((item) => item.asset_id),
        },
      },
      data: {
        deletedAt: null,
      },
    });

    // hapus disposal
    return tx.disposal.delete({
      where: {
        disposal_id,
      },
    });
  });
};


const updateDisposalHeader = async (
  disposal_id: string,
  data: UpdateDisposalHeaderInput,
) => {
  const disposal = await prisma.disposal.findUnique({ where: { disposal_id } });
  if (!disposal) throw new Error("Disposal not found");

  return await prisma.disposal.update({
    where: { disposal_id },
    data: {
      memo_date: data.memo_date,
      subject: data.subject,
      from: data.from,
      to: data.to,
      cc: data.cc,
      description: data.description,
    },
  });
};

const addDisposalItems = async (
  disposal_id: string,
  data: AddDisposalItemsInput,
) => {
  return await prisma.$transaction(async (tx) => {
    const disposal = await tx.disposal.findUnique({ where: { disposal_id } });
    if (!disposal) throw new Error("Disposal not found");

    await tx.disposalItem.createMany({
      data: data.items.map((item) => ({
        disposal_id,
        asset_id: item.asset_id,
        method: item.method,
        notes: item.notes,
        recipient_name: item.recipient_name ? item.recipient_name : null
      })),
    });

    await tx.asset.updateMany({
      where: {
        asset_id: { in: data.items.map((item) => item.asset_id) },
      },
      data: {
        deletedAt: new Date(),
        status: AssetStatus.Dihapus,
      },
    });

    return await tx.disposal.findUnique({
      where: { disposal_id },
      include: {
        items: {
          include: {
            asset: { include: { asset_category: true } },
          },
        },
      },
    });
  });
};

const removeDisposalItem = async (disposal_id: string, asset_id: string) => {
  return await prisma.$transaction(async (tx) => {
    const item = await tx.disposalItem.findFirst({
      where: { disposal_id, asset_id },
    });
    if (!item) throw new Error("Item not found");

    await tx.disposalItem.delete({
      where: { disposal_item_id: item.disposal_item_id },
    });

    await tx.asset.update({
      where: { asset_id },
      data: {
        deletedAt: null,
        status: AssetStatus.Tersedia,
      },
    });

    return await tx.disposal.findUnique({
      where: { disposal_id },
      include: {
        items: {
          include: {
            asset: { include: { asset_category: true } },
          },
        },
      },
    });
  });
};

export default {
  createDisposal,
  getAllDisposals,
  getDisposalById,
  updateDisposal,
  deleteDisposal,
  updateDisposalHeader,
  addDisposalItems,
  removeDisposalItem,
};
