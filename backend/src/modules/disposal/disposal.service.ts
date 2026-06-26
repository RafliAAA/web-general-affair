import { CreateDisposalInput } from "./disposal.dto";
import disposalRepository from "./disposal.repository";

const createDisposal = async (data: CreateDisposalInput) => {
  const disposal = await disposalRepository.createDisposal(data);

  if (!disposal) throw new Error("Failed to create disposal");

  return disposal;
};

const getAllDisposals = async () => {
  const disposal = await disposalRepository.getAllDisposals();

  if (!disposal) throw new Error("Failed to retrived disposal");

  return disposal;
};

const getDisposalById = async (disposal_id: string) => {
  const disposal = await disposalRepository.getDisposalById(disposal_id);

  if (!disposal) throw new Error("Failed to retrived disposal");

  return disposal;
};

const updateDisposal = async (
  disposal_id: string,
  data: CreateDisposalInput,
) => {
  const disposal = await disposalRepository.updateDisposal(disposal_id, data);

  if (!disposal) throw new Error("Failed to update disposal");

  return disposal;
};

const deleteDisposal = async (disposal_id: string) => {
  const disposal = await disposalRepository.deleteDisposal(disposal_id);

  if (!disposal) throw new Error("Failed to delete disposal");

  return disposal;
};

export default {
  createDisposal,
  getAllDisposals,
  getDisposalById,
  updateDisposal,
  deleteDisposal,
};
