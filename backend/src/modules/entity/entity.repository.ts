import prisma from "../../config/prisma";
import type { CreateEntityDTO } from "./entity.dto";

const createEntity = async (data: CreateEntityDTO) => {
  return await prisma.entity.create({ data });
};

const getAllEntities = async () => {
  return await prisma.entity.findMany({
    include: { directorates: true, _count: { select: { profiles: true } } },
    orderBy: { entity_name: "asc" },
  });
};

const updateEntity = async (id: string, data: Partial<CreateEntityDTO>) => {
  return await prisma.entity.update({
    where: { entity_id: id },
    data,
  });
};

const deleteEntity = async (id: string) => {
  return await prisma.entity.delete({
    where: { entity_id: id },
  });
};

export default {
  createEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
};