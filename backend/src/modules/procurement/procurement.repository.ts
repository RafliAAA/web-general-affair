import prisma from "../../config/prisma";
import {
  CreateProcurementInput,
  UpdateProcurementInput,
} from "./procurement.dto";

const createProcurement = async (data: CreateProcurementInput) => {
  const { items, ...procurementData } = data;

  return await prisma.procurement.create({
    data: {
      ...procurementData,
      items: {
        createMany: {
          data: items,
        },
      },
    },
    include: {
      items: true,
    },
  });
};

const getAllProcurements = async () => {
  return await prisma.procurement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include:{
        items:true
    }
  });
};

const getProcurementById = async (procurement_id: string) => {
  return await prisma.procurement.findUnique({
    where: { procurement_id },
    include: {
      items: true,
    },
  });
};

const updateProcurement = async (
  procurement_id: string,
  data: UpdateProcurementInput,
) => {
  const { items, ...procurementData } = data;

  return await prisma.$transaction(async (tx) => {
    await tx.procurement.update({
      where: { procurement_id },
      data: {
        ...procurementData,
      },
    });

    await tx.procurementItem.deleteMany({
      where: { procurement_id },
    });

    const itemsWithId = items.map((item) => ({
      ...item,
      procurement_id,
    }));

    await tx.procurementItem.createMany({
      data: itemsWithId,
    });

    return await tx.procurement.findUnique({
      where: { procurement_id },
      include: { items: true },
    });
  });
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
