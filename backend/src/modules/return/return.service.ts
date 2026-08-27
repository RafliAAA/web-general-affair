import { AssetCondition } from "@prisma/client";
import returnRepository from "./return.repository";

const createReturn = async (data: {
  borrow_id?: string;
  handover_id?: string;
  return_condition: AssetCondition;
  approved_by: string;
  notes?: string;
}) => {
  const result = await returnRepository.createReturn(data);

  if (!result) throw new Error("Failed to create return");
  return result;
};

export default {
  createReturn,
};
