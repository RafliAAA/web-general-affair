import prisma from "../../config/prisma";
import { AssetStatus, BorrowStatus } from "@prisma/client";

const createBorrowRequest = async (data: {
  asset_id: string;
  user_id: string;
  borrow_reason: string;
  expected_return_date: Date;
}) => {
  return await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { asset_id: data.asset_id },
    });

    if (!asset) throw new Error("Asset not found");
    if (asset.status !== AssetStatus.Tersedia) {
      throw new Error("Asset is not available");
    }

    const existingBorrow = await tx.borrow.findFirst({
      where: {
        asset_id: data.asset_id,
        user_id: data.user_id,
        status: {
          in: [BorrowStatus.Menunggu, BorrowStatus.Disetujui],
        },
      },
    });

    if (existingBorrow) {
      throw new Error(
        "You already have an active borrow request for this asset",
      );
    }

    return await tx.borrow.create({
      data,
    });
  });
};

const cancelBorrowRequest = async (borrow_id: string) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
    });

    if (!borrow) throw new Error("Borrow not found");

    if (borrow.status !== BorrowStatus.Menunggu) {
      throw new Error("Only pending borrow requests can be cancelled");
    }

    // Update status aset kembali ke Tersedia
    await tx.asset.update({
      where: { asset_id: borrow.asset_id },
      data: { status: AssetStatus.Tersedia },
    });

    // Update status borrow ke Dibatalkan
    return await tx.borrow.update({
      where: { borrow_id },
      data: { status: BorrowStatus.Dibatalkan },
    });
  });
};

const getAllBorrowRequest = async () => {
  return await prisma.borrow.findMany({
    where: {
      status: BorrowStatus.Menunggu,
    },
    include: {
      asset: {
        select: {
          asset_name: true,
          serial_number: true,
          asset_type: true,
        },
      },
      user: {
        select: {
          profile: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllActiveBorrow = async () => {
  return await prisma.borrow.findMany({
    where: {
      status: BorrowStatus.Disetujui,
    },
    include: {
      asset: {
        select: {
          asset_name: true,
          serial_number: true,
          asset_type: true,
        },
      },
      user: {
        select: {
          profile: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBorrowRequestByUserId = async (user_id: string) => {
  return await prisma.borrow.findMany({
    where: { user_id },
    include: {
      asset: {
        select: {
          asset_name: true,
          serial_number: true,
          asset_type: true,
          location: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getMyBorrows = async (user_id: string) => {
  return await prisma.borrow.findMany({
    where: {
      user_id,
      status: { in: [BorrowStatus.Menunggu, BorrowStatus.Disetujui] },
    },
    include: {
      asset: {
        select: {
          asset_name: true,
          serial_number: true,
          asset_type: true,
          location: true,
        },
      },
    },
  });
};

const approveBorrowRequest = async (borrow_id: string, approved_by: string) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
    });

    if (!borrow) throw new Error("Borrow request not found");

    const approved = await tx.borrow.update({
      where: { borrow_id },
      data: { status: BorrowStatus.Disetujui, approved_by },
      include: {
        approver: {
          select: {
            profile: { select: { name: true } },
          },
        },
      },
    });

    await tx.borrow.updateMany({
      where: {
        asset_id: borrow.asset_id,
        status: BorrowStatus.Menunggu,
        borrow_id: { not: borrow_id },
      },
      data: { status: BorrowStatus.Ditolak },
    });

    await tx.asset.update({
      where: { asset_id: borrow.asset_id },
      data: { status: AssetStatus.Dipinjam },
    });

    return approved;
  });
};

const rejectBorrowRequest = async (borrow_id: string, approved_by: string) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
    });

    return await tx.borrow.update({
      where: { borrow_id },
      data: { status: BorrowStatus.Ditolak, approved_by },
    });
  });
};

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getAllActiveBorrow,
  getBorrowRequestByUserId,
  getMyBorrows,
  approveBorrowRequest,
  rejectBorrowRequest,
};
