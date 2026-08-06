import prisma from "../config/prisma"
import { AssetStatus, Prisma } from "@prisma/client";


export const generatePrNumber = async (): Promise<string> => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2); // 2 digit tahun (misal: 23)
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // 2 digit bulan (misal: 12)

  // 1. Prefix format: PR + YY + MM (Contoh: PR2312)
  const prefix = `PR${yy}${mm}`;

  // 2. Cari pengadaan terakhir di bulan ini yang nomornya dimulai dengan prefix di atas
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

  // 3. Tentukan nomor urut (sequence)
  let sequence = 1;
  if (lastProcurement?.pr_number) {
    // Ambil 4 digit terakhir dari PR number lama, lalu tambah 1
    const lastSequence = parseInt(lastProcurement.pr_number.slice(-4), 10);
    sequence = lastSequence + 1;
  }

  // 4. Gabungkan: PR2312 + 0001
  return `${prefix}${String(sequence).padStart(4, "0")}`;
};


export const generateAssetCode = async (
  tx?: Prisma.TransactionClient,
  categoryId?: string,
) => {
  const client = tx || prisma;

  // 1. Tentukan kode kategori (default "00" kalau null)
  let categoryCode = "00";
  if (categoryId) {
    const category = await client.assetCategory.findUnique({
      where: { asset_category_id: categoryId },
    });
    if (category?.category_code) {
      categoryCode = category.category_code;
    }
  }

  // 2. Format prefix yang dicari (Contoh: "AST-02")
  const searchPrefix = `AST-${categoryCode}`;

  // 3. Cari aset terakhir yang kodenya diawali dengan prefix di atas
  const lastAsset = await client.asset.findFirst({
    where: {
      asset_code: { startsWith: searchPrefix },
    },
    orderBy: { asset_code: "desc" },
    select: { asset_code: true },
  });

  // 4. Ambil 4 digit terakhir dari aset terakhir
  let lastNumber = 0;
  if (lastAsset?.asset_code) {
    const last4Digits = lastAsset.asset_code.slice(-4); // Ambil 4 angka paling belakang
    lastNumber = parseInt(last4Digits, 10) || 0;
  }

  // 5. Gabungkan: AST-02 + 0001
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

  // Map untuk menyimpan urutan terakhir per kategori di memori
  const sequenceMap: Record<string, number> = {};

  for (const dbItem of createdItems) {
    if (dbItem.quantity_approved > 0) {
      // Ambil kode kategori, default "00"
      const categoryCode = dbItem.asset_category?.category_code || "00";
      const searchPrefix = `AST-${categoryCode}`;

      // Kalau kategori ini belum dicek di database, cek 1 kali
      if (!(categoryCode in sequenceMap)) {
        const lastAsset = await tx.asset.findFirst({
          where: {
            asset_code: { startsWith: searchPrefix },
          },
          orderBy: { asset_code: "desc" },
          select: { asset_code: true },
        });

        let lastNum = 0;
        if (lastAsset?.asset_code) {
          const last4Digits = lastAsset.asset_code.slice(-4);
          lastNum = parseInt(last4Digits, 10) || 0;
        }
        sequenceMap[categoryCode] = lastNum;
      }

      // Looping sebanyak qty approved
      for (let i = 0; i < dbItem.quantity_approved; i++) {
        sequenceMap[categoryCode] += 1;

        // Format kode: AST-020001
        const assetCode = `${searchPrefix}${String(sequenceMap[categoryCode]).padStart(4, "0")}`;

        assetsToCreate.push({
          asset_code: assetCode,
          asset_name: dbItem.description,
          asset_category_id: dbItem.asset_category_id || null,
          purchase_date: proc?.pr_date || new Date(),
          serial_number: null,
          condition: "Baik",
          status: AssetStatus.Tersedia,
          procurement_item_id: dbItem.procurement_item_id,
        });
      }
    }
  }

  // Bulk Insert
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
  if (lastDisposal?.memo_number) {
    const match = lastDisposal.memo_number.match(/INT\/(\d+)\//);
    if (match) {
      increment = parseInt(match[1]) + 1;
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

  // Hitung berapa form yang sudah dibuat bulan ini
  const countThisMonth = await tx.actualizationForm.count({
    where: {
      form_date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
  });

  // Format: SVC + YY + MM + Urutan (4 digit)
  const yy = String(year).slice(-2);
  const mm = String(month + 1).padStart(2, "0");
  const sequence = String(countThisMonth + 1).padStart(4, "0");

  return `SVC${yy}${mm}${sequence}`;
};

