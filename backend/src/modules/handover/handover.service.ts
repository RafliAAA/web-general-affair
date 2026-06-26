import handoverRepository from "./handover.repository";
import type { CreateHandoverDTO, ReturnHandoverDTO } from "./handover.dto";

const createHandover = async (data: CreateHandoverDTO, created_by: string) => {
  const result = await handoverRepository.createHandover(data, created_by);
  if (!result) throw new Error("Failed to create handover");
  return result;
};

const getAllHandover = async () => {
  const result = await handoverRepository.getAllHandover();
  if (!result) throw new Error("Failed to fetch handovers");
  return result;
};

const getHandoverById = async (handover_id: string) => {
  const result = await handoverRepository.getHandoverById(handover_id);
  if (!result) throw new Error("Handover not found");
  return result;
};

const getHandoverByUser = async (user_id: string) => {
  const result = await handoverRepository.getHandoverByUser(user_id);
  if (!result) throw new Error("Failed to fetch handovers");
  return result;
};

const returnHandover = async (
  handover_id: string,
  returned_by: string,
  data: ReturnHandoverDTO,
) => {
  const result = await handoverRepository.returnHandover(
    handover_id,
    returned_by,
    data,
  );
  if (!result) throw new Error("Failed to process return");
  return result;
};

export default {
  createHandover,
  getAllHandover,
  getHandoverById,
  getHandoverByUser,
  returnHandover,
};
