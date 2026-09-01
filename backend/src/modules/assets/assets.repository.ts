import {
  AssetStatus,
  BorrowStatus,
  HandoverStatus,
  MaintenanceStatus,
} from "@prisma/client";
import prisma from "../../config/prisma";
import { generateAssetCode } from "../../helper/generate.code";

const createAsset = async (data: any) => {
  const assetCode = await generateAssetCode(prisma, data.asset_category_id);

  return prisma.asset.create({
    data: {
      ...data,
      asset_code: assetCode,
    },
    include: {
      asset_category: true,
    },
  });
};

const findAllAssets = async (filter: {
  search?: string;
  status?: string;
  asset_category_id?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 8;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.asset_category_id) {
    where.asset_category_id = filter.asset_category_id;
  }

  if (filter.search) {
    where.OR = [
      { asset_name: { contains: filter.search } },
      { asset_code: { contains: filter.search } },
      { serial_number: { contains: filter.search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      skip,
      take: limit,
      orderBy: { asset_name: "asc" },
      include: {
        asset_category: true,
        borrow: {
          where: { 
            status: { in: ["Disetujui"] } 
          },
          include: { 
            user: { 
              select: { profile: { select: { name: true } } } 
            } 
          },
          take: 1,
        },
        handoverItems: {
          where: { 
            handover: { status: "Aktif" } 
          },
          include: { 
            handover: { 
              select: { 
                receiver: { select: { profile: { select: { name: true } } } } 
              } 
            } 
          },
          take: 1,
        }
      },
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findAssetById = async (asset_id: string) => {
  return await prisma.asset.findUnique({
    where: { asset_id },
    include: {
      asset_category: true,
      borrow: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
          returns: true,
        },
      },
      maintenances: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          reporter: {
            select: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      handoverItems: {
        orderBy: {
          handover: {
            handover_date: "desc",
          },
        },
        include: {
          handover: {
            include: {
              receiver: {
                select: {
                  profile: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

const updateAsset = async (asset_id: string, data: any) => {
  return await prisma.asset.update({
    where: { asset_id },
    data,
    include: {
      borrow: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
          returns: true,
        },
      },
    },
  });
};

const deleteAsset = async (asset_id: string) => {
  return await prisma.asset.delete({
    where: { asset_id },
  });
};

const getAvailableAssets = async () => {
  return await prisma.asset.findMany({
    where: {
      status: AssetStatus.Tersedia,
      deletedAt: null,
      borrow: {
        none: {
          status: { in: [BorrowStatus.Menunggu, BorrowStatus.Disetujui] },
        },
      },
    },
    orderBy: { asset_name: "asc" },
    include: { asset_category: true },
  });
};

const getBorrowedAssets = async () => {
  return await prisma.asset.findMany({
    where: { status: "Dipinjam" },
    orderBy: { asset_name: "asc" },
  });
};

const getMyAssets = async (user_id: string, excludeMaintenance = false) => {
  const where: any = {
    OR: [
      {
        borrow: {
          some: {
            user_id,
            status: BorrowStatus.Disetujui,
          },
        },
      },
      {
        handoverItems: {
          some: {
            handover: {
              user_id,
              status: HandoverStatus.Aktif,
            },
          },
        },
      },
    ],
  };

  if (excludeMaintenance) {
    where.maintenances = {
      none: {
        status: {
          in: [
            MaintenanceStatus.MenungguVerifikasi,
            MaintenanceStatus.MenungguDikerjakan,
            MaintenanceStatus.SedangDikerjakan,
          ],
        },
      },
    };
  }

  return prisma.asset.findMany({
    where,
    include: {
      asset_category: {
        select: {
          category_name: true,
        },
      },
    },
    orderBy: {
      asset_name: "asc",
    },
  });
};

const getBorrowableAssets = async () => {
  return await prisma.asset.findMany({
    where: {
      status: { in: [AssetStatus.Tersedia, AssetStatus.Dipinjam] },
      deletedAt: null, 
    },
    orderBy: { asset_name: "asc" },
    include: { asset_category: true },
  });
};

// ─── Asset Category ───────────────────────────────────────────────────────────

const findAllCategories = async () => {
  return await prisma.assetCategory.findMany({
    orderBy: { category_name: "asc" },
    include: { _count: { select: { assets: true } } },
  });
};

const findCategoryById = async (asset_category_id: string) => {
  return await prisma.assetCategory.findUnique({
    where: { asset_category_id },
    include: { _count: { select: { assets: true } } },
  });
};

const createCategory = async (data: {
  category_name: string;
  category_code: string;
}) => {
  return await prisma.assetCategory.create({ data });
};

const updateCategory = async (
  asset_category_id: string,
  data: { category_name?: string; category_code?: string },
) => {
  return await prisma.assetCategory.update({
    where: { asset_category_id },
    data,
  });
};

const deleteCategory = async (asset_category_id: string) => {
  // cek apakah kategori masih dipakai aset
  const count = await prisma.asset.count({
    where: { asset_category_id, deletedAt: null },
  });

  if (count > 0) {
    throw new Error(
      `Kategori tidak bisa dihapus karena masih digunakan oleh ${count} aset`,
    );
  }

  return await prisma.assetCategory.delete({ where: { asset_category_id } });
};

export default {
  createAsset,
  findAllAssets,
  findAssetById,
  updateAsset,
  deleteAsset,
  getAvailableAssets,
  getBorrowedAssets,
  getMyAssets,
  getBorrowableAssets,
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
