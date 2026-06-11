import prisma from "../../config/prisma";

const createAsset = async (data: any) => {
  return await prisma.asset.create({
    data,
  });
};

const findAllAssets = async (filter: any) => {
  return await prisma.asset.findMany(filter);
};

const findAssetById = async (asset_id: string) => {
  return await prisma.asset.findUnique({
    where: { asset_id },
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
    where: {status: 'Tersedia'},
    orderBy : { asset_name : 'asc' }
  })
}

const getBorrowedAssets = async () => {
  return await prisma.asset.findMany({
    where: {status: 'Dipinjam'},
    orderBy : { asset_name : 'asc' }
  })
}

export default {
  createAsset,
  findAllAssets,
  findAssetById,
  updateAsset,
  deleteAsset,
  getAvailableAssets,
  getBorrowedAssets
};
