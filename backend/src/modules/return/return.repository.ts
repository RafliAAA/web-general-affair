import prisma from "../../config/prisma";
import { AssetCondition, AssetStatus, BorrowStatus } from "@prisma/client";

const createReturn = async (
  borrow_id: string,
  return_condition: AssetCondition,
  approved_by: string,
  notes?: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.findUnique({
      where: { borrow_id },
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
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    await tx.borrow.update({
      where: { borrow_id },
      data: {
        status: BorrowStatus.Dikembalikan,
      },
    });

    await tx.asset.update({
      where: {
        asset_id: borrow.asset_id,
      },
      data: {
        status: AssetStatus.Tersedia,
        condition: return_condition as AssetCondition,
      },
    });

    return returned;
  });
};

export default {
  createReturn,
};
