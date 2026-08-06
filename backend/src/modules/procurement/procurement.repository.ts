import prisma from "../../config/prisma";
import { generateAssetsFromProcurement, generatePrNumber } from "../../helper/generate.code";
import {
  CreateProcurementInput,
  UpdateProcurementInput,
} from "./procurement.dto";

const createProcurement = async (data: CreateProcurementInput) => {
  const { items, ...procurementData } = data;

  const pr_number = await generatePrNumber();

  return await prisma.procurement.create({
    data: {
      ...procurementData,
      pr_number, 
      actualization_id: procurementData.actualization_id || null, 
      items: {
        createMany: {
          data: items,
        },
      },
    },
    include: {
      items: true,
      actualization: true
    },
  });
};


const getAllProcurements = async () => {
  return await prisma.procurement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      actualization: true, 
    },
  });
};

const getProcurementById = async (procurement_id: string) => {
  return await prisma.procurement.findUnique({
    where: { procurement_id },
    include: {
      items: {
        include: {
          assets: {
            select: {
              asset_id: true,
              asset_code: true,
              asset_name: true,
              status: true,
              condition: true
            }
          }
        }
      },
      actualization: true, 
    },
  });
};

const updateProcurement = async (
  procurement_id: string,
  data: UpdateProcurementInput,
) => {
  const { items, status, ...procurementData } = data;

  return await prisma.$transaction(async (tx) => {
    const existingProc = await tx.procurement.findUnique({
      where: { procurement_id },
      select: { status: true }
    });

    const previousStatus = existingProc?.status;

    await tx.procurement.update({
      where: { procurement_id },
      data: {
        ...procurementData,
        ...(status ? { status } : {}),
      },
    });

    if (previousStatus === "Menunggu") {
      
      await tx.procurementItem.deleteMany({
        where: { procurement_id },
      });

      const itemsToCreate = items.map((item) => ({
        procurement_id,
        part_number: item.part_number,
        description: item.description,
        quantity: item.quantity,
        quantity_approved: item.quantity_approved,
        unit_of_measure: item.unit_of_measure,
        asset_category_id: item.asset_category_id || null,
      }));

      await tx.procurementItem.createMany({
        data: itemsToCreate,
      });

      if (status === "Disetujui") {
        await generateAssetsFromProcurement(tx, procurement_id);
      }
    }

    return await tx.procurement.findUnique({
      where: { procurement_id },
      include: { items: true },
    });
  },{ timeout: 15000 } );
};

const deleteProcurement = async (procurement_id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.procurementItem.deleteMany({
      where: { procurement_id },
    });

    const data = await tx.procurement.delete({
      where: { procurement_id },
    });

    return data;
  });
};
export default {
  createProcurement,
  getAllProcurements,
  getProcurementById,
  updateProcurement,
  deleteProcurement,
};
