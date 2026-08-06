import entityRepository from "./entity.repository";
import type { CreateEntityDTO } from "./entity.dto";

const createEntity = async (data: CreateEntityDTO) => {
  const result = await entityRepository.createEntity(data);
  if (!result) throw new Error("Failed to create entity");
  return result;
};

const getAllEntities = async () => {
  const result = await entityRepository.getAllEntities();
  if (!result) throw new Error("Failed to fetch entities");
  return result;
};

// TAMBAHKAN INI
const updateEntity = async (id: string, data: Partial<CreateEntityDTO>) => {
  const result = await entityRepository.updateEntity(id, data);
  if (!result) throw new Error("Failed to update entity");
  return result;
};

// TAMBAHKAN INI
const deleteEntity = async (id: string) => {
  try {
    const result = await entityRepository.deleteEntity(id);
    return result;
  } catch (error: any) {
    if (error.code === "P2003") {
      throw new Error(
        "Entity tidak dapat dihapus karena masih digunakan oleh data User/Handover.",
      );
    }
    throw new Error("Failed to delete entity");
  }
};

export default {
  createEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
};
