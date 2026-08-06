import directorateRepository from "./directorate.repository";
import type { CreateDirectorateDTO } from "./directorate.dto";

const createDirectorate = async (data: CreateDirectorateDTO) => {
  const result = await directorateRepository.createDirectorate(data);
  if (!result) throw new Error("Failed to create directorate");
  return result;
};

const getAllDirectorates = async (entity_id?: string) => {
  const result = await directorateRepository.getAllDirectorates(entity_id);
  if (!result) throw new Error("Failed to fetch directorates");
  return result;
};

const updateDirectorate = async (
  id: string,
  data: Partial<CreateDirectorateDTO>,
) => {
  const result = await directorateRepository.updateDirectorate(id, data);
  if (!result) throw new Error("Failed to update directorate");
  return result;
};

// TAMBAHKAN INI
const deleteDirectorate = async (id: string) => {
  try {
    const result = await directorateRepository.deleteDirectorate(id);
    return result;
  } catch (error: any) {
    if (error.code === "P2003") {
      throw new Error(
        "Direktorat tidak dapat dihapus karena masih digunakan oleh data User/Handover.",
      );
    }
    throw new Error("Failed to delete directorate");
  }
};

export default {
  createDirectorate,
  getAllDirectorates,
  updateDirectorate,
  deleteDirectorate,
};
