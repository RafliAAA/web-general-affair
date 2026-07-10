import prisma from "../config/prisma"

export const generateAssetCode = async () => {
  const lastAsset = await prisma.asset.findFirst({
    orderBy: {
      asset_code: "desc",
    },
    select: {
      asset_code: true,
    },
  });

  const lastNumber = lastAsset
    ? parseInt(lastAsset.asset_code.replace("AST-", ""), 10)
    : 0;

  return `AST-${String(lastNumber + 1).padStart(6, "0")}`;
};

