import prisma from "../config/prisma";
import { AssetStatus, Prisma } from "@prisma/client";

export const generatePrNumber = async (): Promise<string> => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const prefix = `PR${yy}${mm}`;

  const lastProcurement = await prisma.procurement.findFirst({
    where: {
      pr_number: {
        startsWith: prefix,
      },
    },
    orderBy: {
      pr_number: "desc",
    },
    select: {
      pr_number: true,
    },
  });

  let sequence = 1;
  // PASTIKAN OBJECTNYA ADA DULU
  if (lastProcurement && lastProcurement.pr_number) {
    const lastSequence = parseInt(lastProcurement.pr_number.slice(-4), 10);
    sequence = isNaN(lastSequence) ? 1 : lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(4, "0")}`;
};

export const generateAssetCode = async (
  tx?: Prisma.TransactionClient,
  categoryId?: string,
) => {
  const client = tx || prisma;

  let categoryCode = "00";
  if (categoryId) {
    const category = await client.assetCategory.findUnique({
      where: { asset_category_id: categoryId },
    });
    // PASTIKAN OBJECTNYA ADA
    if (category && category.category_code) {
      categoryCode = category.category_code;
    }
  }

  const searchPrefix = `AST-${categoryCode}`;

  const lastAsset = await client.asset.findFirst({
    where: {
      asset_code: { startsWith: searchPrefix },
    },
    orderBy: { asset_code: "desc" },
    select: { asset_code: true },
  });

  let lastNumber = 0;
  // PASTIKAN OBJECTNYA ADA
  if (lastAsset && lastAsset.asset_code) {
    const last4Digits = lastAsset.asset_code.slice(-4);
    lastNumber = parseInt(last4Digits, 10) || 0;
  }

  return `${searchPrefix}${String(lastNumber + 1).padStart(4, "0")}`;
};

export const generateAssetsFromProcurement = async (
  tx: Prisma.TransactionClient,
  procurement_id: string,
) => {
  const proc = await tx.procurement.findUnique({
    where: { procurement_id },
  });

  const createdItems = await tx.procurementItem.findMany({
    where: { procurement_id },
    include: { asset_category: true },
  });

  const assetsToCreate: any[] = [];

  const sequenceMap: Record<string, number> = {};

  for (const dbItem of createdItems) {
    if (dbItem.quantity_approved > 0) {
      const categoryCode = dbItem.asset_category?.category_code || "00";
      const searchPrefix = `AST-${categoryCode}`;

      if (!(categoryCode in sequenceMap)) {
        const lastAsset = await tx.asset.findFirst({
          where: {
            asset_code: { startsWith: searchPrefix },
          },
          orderBy: { asset_code: "desc" },
          select: { asset_code: true },
        });

        let lastNum = 0;
        // PASTIKAN OBJECTNYA ADA
        if (lastAsset && lastAsset.asset_code) {
          const last4Digits = lastAsset.asset_code.slice(-4);
          lastNum = parseInt(last4Digits, 10) || 0;
        }
        sequenceMap[categoryCode] = lastNum;
      }

      for (let i = 0; i < dbItem.quantity_approved; i++) {
      sequenceMap[categoryCode] = (sequenceMap[categoryCode] ?? 0) + 1;

        const assetCode = `${searchPrefix}${String(sequenceMap[categoryCode]).padStart(4, "0")}`;

        assetsToCreate.push({
          asset_code: assetCode,
          asset_name: dbItem.description,
          asset_category_id: dbItem.asset_category_id || null,
          // PASTIKAN proc TIDAK UNDEFINED
          purchase_date: proc?.pr_date || new Date(),
          serial_number: null,
          condition: "Baik",
          status: AssetStatus.Tersedia,
          procurement_item_id: dbItem.procurement_item_id,
        });
      }
    }
  }

  if (assetsToCreate.length > 0) {
    await tx.asset.createMany({
      data: assetsToCreate,
    });
  }
};

export const generateMemoNumber = async (tx: any): Promise<string> => {
  const lastDisposal = await tx.disposal.findFirst({
    orderBy: { createdAt: "desc" },
  });

  let increment = 1;
  // PASTIKAN OBJECTNYA ADA
  if (lastDisposal && lastDisposal.memo_number) {
    const match = lastDisposal.memo_number.match(/INT\/(\d+)\//);
    // PASTIKAN ARRAY MATCH ADA DAN INDEX 1 NYA ADA
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      increment = isNaN(parsed) ? 1 : parsed + 1;
    }
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const paddedIncrement = String(increment).padStart(4, "0");

  return `INT/${paddedIncrement}/IM/HCGA/SYAAMILGROUP/${day}/${month}/${year}`;
};

export const generateActualizationFormNumber = async (
  tx: Prisma.TransactionClient,
) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 1);

  const countThisMonth = await tx.actualizationForm.count({
    where: {
      form_date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
  });

  const yy = String(year).slice(-2);
  const mm = String(month + 1).padStart(2, "0");
  const sequence = String(countThisMonth + 1).padStart(4, "0");

  return `SVC${yy}${mm}${sequence}`;
};
