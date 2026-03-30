import prisma from "../../config/prisma";
import { BorrowStatus } from "@prisma/client";

const createBorrowRequest = async (data: any) => {
  return await prisma.borrow.create({
    data: data,
  });
};

const cancelBorrowRequest = async (borrow_id: string) => {
  return await prisma.borrow.update({
    where: {
      borrow_id,
    },
    data: {
      status: BorrowStatus.Dibatalkan,
    },
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
          location: true,
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
      data: { status: "Dipinjam" },
    });

    return approved;
  });
};

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getBorrowRequestByUserId,
  getMyBorrows,
  approveBorrowRequest,
};
