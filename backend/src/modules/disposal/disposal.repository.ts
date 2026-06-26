import prisma from "../../config/prisma";
import { CreateDisposalInput } from "./disposal.dto";

const createDisposal = async (data: CreateDisposalInput) => {
  return prisma.$transaction(async (tx) => {
    const disposal = await tx.disposal.create({
      data: {
        memo_number: data.memo_number,
        memo_date: data.memo_date,
        subject: data.subject,
        description: data.description,
      },
    });

    await tx.disposalItem.createMany({
      data: data.items.map((item) => ({
        disposal_id: disposal.disposal_id,
        asset_id: item.asset_id,
        method: item.method,
        notes: item.notes,
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
      disposal_id
    },
    include: {
      items: {
        include: {
          asset: true,
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
        disposal_id
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
      },
    });

    // hapus item lama
    await tx.disposalItem.deleteMany({
      where: {
        disposal_id
      },
    });

    // update header
    await tx.disposal.update({
      where: {
        disposal_id
      },
      data: {
        memo_number: data.memo_number,
        memo_date: data.memo_date,
        subject: data.subject,
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
        disposal_id
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

const deleteDisposal = async (disposal_id: string) => {
  return prisma.$transaction(async (tx) => {
    const disposal = await tx.disposal.findUnique({
      where: {
        disposal_id
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
        disposal_id
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
};
