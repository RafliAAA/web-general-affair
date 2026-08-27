import prisma from "../../config/prisma";
import { 
  AssetCondition, 
  AssetStatus, 
  BorrowStatus, 
  HandoverStatus,
  MaintenanceStatus,
  MaintenanceSource 
} from "@prisma/client";

interface CreateReturnData {
  borrow_id?: string;
  handover_id?: string;
  return_condition: AssetCondition;
  approved_by: string; 
  notes?: string;
}

const createReturn = async (data: CreateReturnData) => {
  const { borrow_id, handover_id, return_condition, approved_by, notes } = data;

  return await prisma.$transaction(async (tx) => {
    let asset_id: string = "";
    let user_id: string = "";
    let categoryName: string = "";

    // 1. CEK APAKAH INI PENGEMBALIAN BORROW ATAU HANDOVER
    if (borrow_id) {
      const borrow = await tx.borrow.findUnique({
        where: { borrow_id },
        include: { asset: { include: { asset_category: true } } }
      });

      if (!borrow) throw new Error("Borrow not found");

      const existingReturn = await tx.return.findUnique({ where: { borrow_id } });
      if (existingReturn) throw new Error("Asset has already been returned");

      asset_id = borrow.asset_id;
      user_id = borrow.user_id;
      categoryName = borrow.asset.asset_category?.category_name || "";

      // Update status Borrow jadi Dikembalikan
      await tx.borrow.update({
        where: { borrow_id },
        data: { status: BorrowStatus.Dikembalikan },
      });

    } else if (handover_id) {
      const handover = await tx.handover.findUnique({
        where: { handover_id },
        include: { items: { include: { asset: { include: { asset_category: true } } } } }
      });

      if (!handover) throw new Error("Handover not found");

      const existingReturn = await tx.return.findUnique({ where: { handover_id } });
      if (existingReturn) throw new Error("Asset has already been returned");

      // Update status Handover jadi Dikembalikan
      await tx.handover.update({
        where: { handover_id },
        data: {
          status: HandoverStatus.Dikembalikan,
          returned_at: new Date(),
          returned_by: approved_by,
          return_notes: notes || null,
        },
      });

      for (const item of handover.items) {
        if (return_condition === AssetCondition.Rusak) {
          await tx.asset.update({
            where: { asset_id: item.asset_id },
            data: { status: AssetStatus.Diperbaiki, condition: return_condition },
          });

          const isITAsset = item.asset.asset_category?.category_name === "Elektronik" || item.asset.asset_category?.category_name === "IT";
          const maintenanceStatus = isITAsset ? MaintenanceStatus.MenungguDikerjakan : MaintenanceStatus.SedangDikerjakan;

          await tx.maintenance.create({
            data: {
              asset_id: item.asset_id,
              reported_by: handover.user_id,
              description: notes || "Rusak saat dikembalikan dari serah terima (Handover)",
              status: maintenanceStatus,
              source: MaintenanceSource.PENGEMBALIAN_ASET,
              verified_by: approved_by,
              verified_at: new Date(),
              taken_by: isITAsset ? null : approved_by,
              taken_at: isITAsset ? null : new Date(),
            },
          });
        } else {
          await tx.asset.update({
            where: { asset_id: item.asset_id },
            data: { status: AssetStatus.Tersedia, condition: return_condition },
          });
        }
      }

      const returnedHandover = await tx.return.create({
        data: {
          handover_id,
          return_condition,
          notes: notes ?? null,
          approved_by,
        },
        include: { approver: { select: { profile: { select: { name: true } } } } },
      });

      return returnedHandover;

    } else {
      throw new Error("Either borrow_id or handover_id is required");
    }

    if (return_condition === AssetCondition.Rusak) {
      await tx.asset.update({
        where: { asset_id },
        data: {
          status: AssetStatus.Diperbaiki,
          condition: return_condition,
        },
      });

      const isITAsset = categoryName === "Elektronik" || categoryName === "IT";
      const maintenanceStatus = isITAsset ? MaintenanceStatus.MenungguDikerjakan : MaintenanceStatus.SedangDikerjakan;  

      await tx.maintenance.create({
        data: {
          asset_id,
          reported_by: user_id, 
          description: notes || "Rusak saat dikembalikan ke GA",
          status: maintenanceStatus, 
          source: MaintenanceSource.PENGEMBALIAN_ASET,
          verified_by: approved_by, 
          verified_at: new Date(),
          taken_by: isITAsset ? null : approved_by, 
          taken_at: isITAsset ? null : new Date(),
        },
      });
    } else {
      await tx.asset.update({
        where: { asset_id },
        data: {
          status: AssetStatus.Tersedia,
          condition: return_condition,
        },
      });
    }

    const returnedBorrow = await tx.return.create({
      data: {
        borrow_id,
        return_condition,
        notes: notes ?? null,
        approved_by,
      },
      include: {
        approver: {
          select: {
            profile: { select: { name: true } },
          },
        },
      },
    });

    return returnedBorrow;
  });
};

export default {
  createReturn,
};