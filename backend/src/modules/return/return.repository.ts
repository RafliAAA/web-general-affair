import prisma from "../../config/prisma";
import { 
  AssetCondition, 
  AssetStatus, 
  BorrowStatus, 
  MaintenanceStatus 
} from "@prisma/client";

const createReturn = async (
  borrow_id: string,
  return_condition: AssetCondition,
  approved_by: string, 
  notes?: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
      include: {
        asset: {
          include: {
            asset_category: true 
          }
        }
      }
    });

    if (!borrow) {
      throw new Error("Borrow not found");
    }

    const existingReturn = await tx.return.findUnique({
      where: { borrow_id },
    });

    if (existingReturn) {
      throw new Error("Asset has already been returned");
    }

    // 2. Buat data Return
    const returned = await tx.return.create({
      data: {
        borrow_id,
        return_condition,
        notes: notes ?? null,
        approved_by,
      },
      include: {
        approver: {
          select: {
            profile: {
              select: { name: true },
            },
          },
        },
      },
    });

    // 3. Update status peminjaman jadi Dikembalikan
    await tx.borrow.update({
      where: { borrow_id },
      data: {
        status: BorrowStatus.Dikembalikan,
      },
    });

    // 4. Logika kondisi aset & Auto-Create Maintenance
    if (return_condition === AssetCondition.Rusak) {
      // Jika rusak, aset tidak bisa Tersedia, tapi Diperbaiki
      await tx.asset.update({
        where: { asset_id: borrow.asset_id },
        data: {
          status: AssetStatus.Diperbaiki,
          condition: return_condition,
        },
      });

      const categoryName = borrow.asset.asset_category?.category_name || "";
      const isITAsset = categoryName === "Elektronik" || categoryName === "IT";

      const maintenanceStatus = isITAsset 
        ? MaintenanceStatus.MenungguDikerjakan 
        : MaintenanceStatus.SedangDikerjakan;  

      // Auto-generate tiket Maintenance
      await tx.maintenance.create({
        data: {
          asset_id: borrow.asset_id,
          reported_by: borrow.user_id, 
          description: notes || "Rusak saat dikembalikan ke GA",
          status: maintenanceStatus, 
          source: "PENGEMBALIAN_ASET",
          verified_by: approved_by, 
          verified_at: new Date(),
          taken_by: isITAsset ? null : approved_by, 
          taken_at: isITAsset ? null : new Date(),
        },
      });
    } else {
      // Jika kondisi Baik/Cukup, aset kembali Tersedia
      await tx.asset.update({
        where: { asset_id: borrow.asset_id },
        data: {
          status: AssetStatus.Tersedia,
          condition: return_condition,
        },
      });
    }

    return returned;
  });
};

export default {
  createReturn,
};