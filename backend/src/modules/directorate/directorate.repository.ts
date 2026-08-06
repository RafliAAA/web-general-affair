import prisma from "../../config/prisma";
import type { CreateDirectorateDTO } from "./directorate.dto";

const createDirectorate = async (data: CreateDirectorateDTO) => {
  return await prisma.directorate.create({ data });
};

const getAllDirectorates = async (entity_id?: string) => {
  return await prisma.directorate.findMany({
    where: entity_id ? { entity_id } : {},
    include: { entity: true, _count: { select: { profiles: true } } },
    orderBy: { directorate_name: "asc" },
  });
};

// TAMBAHKAN INI: Update Directorate
const updateDirectorate = async (
  id: string,
  data: Partial<CreateDirectorateDTO>,
) => {
  return await prisma.directorate.update({
    where: { directorate_id: id },
    data,
  });
};

// TAMBAHKAN INI: Delete Directorate
const deleteDirectorate = async (id: string) => {
  return await prisma.directorate.delete({
    where: { directorate_id: id },
  });
};

export default {
  createDirectorate,
  getAllDirectorates,
  updateDirectorate,
  deleteDirectorate,
};
