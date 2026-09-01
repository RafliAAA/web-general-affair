import prisma from "../../config/prisma";
import { AssetStatus, BorrowStatus } from "@prisma/client";
import { CreateBorrowInput } from "./borrow.dto";

const createBorrowRequest = async (data: CreateBorrowInput) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Cari data user beserta profilnya untuk mendapatkan directorate_id
    const user = await tx.user.findUnique({
      where: { user_id: data.user_id },
      select: {
        profile: {
          select: { directorate_id: true }
        }
      }
    });

    // Jaga-jaga jika user tidak ditemukan atau profilnya belum punya directorate_id
    if (!user || !user.profile || !user.profile.directorate_id) {
      throw new Error("User tidak ditemukan atau belum memiliki directorate di profilnya");
    }

    const userDirectorateId = user.profile.directorate_id;

    // 2. Cek aset
    const asset = await tx.asset.findUnique({
      where: { asset_id: data.asset_id },
    });

    if (!asset) throw new Error("Asset not found");
    if (asset.status !== AssetStatus.Tersedia) {
      throw new Error("Asset is not available");
    }

    // 3. Cek peminjaman yang masih aktif
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

    // 4. Buat record peminjaman beserta directorate_id dari profil
    return await tx.borrow.create({
      data: {
        user_id: data.user_id,
        asset_id: data.asset_id,
        borrow_reason: data.borrow_reason,
        borrow_date: data.borrow_date,
        expected_return_date: data.expected_return_date,
        recipient_type: data.recipient_type || "Personal",
        directorate_id: userDirectorateId, 
      },
    });
  });
};

const cancelBorrowRequest = async (user_id: string, borrow_id: string) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
    });

    if (!borrow) throw new Error("Borrow request not found");

    if (borrow.user_id !== user_id) {
      throw new Error("You are not authorized to cancel this request");
    }

    if (borrow.status !== BorrowStatus.Menunggu) {
      throw new Error("Only pending borrow requests can be cancelled");
    }

    return await tx.borrow.update({
      where: { borrow_id },
      data: { status: BorrowStatus.Dibatalkan },
    });
  });
};

const getAllBorrowRequest = async () => {
  return await prisma.borrow.findMany({
    include: {
      asset: {
        select: {
          asset_name: true,
          asset_code: true,
          serial_number: true,
          asset_category: {
            select: {
              category_name: true,
            },
          },
        },
      },
      user: {
        select: {
          profile: { select: { name: true } },
        },
      },
      // TAMBAHKAN INI agar divisi peminjam ikut terambil
      directorate: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBorrowById = async (borrow_id: string) => {
  return await prisma.borrow.findUnique({
    where: { borrow_id },
    include: {
      asset: {
        select: {
          asset_name: true,
          asset_code: true,
          serial_number: true,
          asset_category: { select: { category_name: true } },
        },
      },
      user: {
        select: { profile: { select: { name: true } } },
      },
      approver: {
        select: { profile: { select: { name: true } } },
      },
      returns: true,
      // TAMBAHKAN INI
      directorate: true,
    },
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
          asset_code: true,
          asset_category: {
            select: {
              category_name: true,
            },
          },
        },
      },
      user: {
        select: {
          profile: { select: { name: true } },
        },
      },
      // TAMBAHKAN INI
      directorate: true,
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
          asset_code: true,
          asset_category: { select: { category_name: true } },
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
          asset_category: { select: { category_name: true } },
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

const markAsTaken = async (borrow_id: string) => {
  return await prisma.borrow.update({
    where: { borrow_id},
    data:  {
      taken_date: new Date(),
    }
  })
}

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getAllActiveBorrow,
  getBorrowRequestByUserId,
  getMyBorrows,
  approveBorrowRequest,
  rejectBorrowRequest,
  getBorrowById,
  markAsTaken,
};
