import { AssetCondition } from "@prisma/client";
import returnRepository from "./return.repository";

const createReturn = async (data: {
  borrow_id: string;
  return_condition: AssetCondition;
  approved_by: string;
  notes?: string;
}) => {
  const result = await returnRepository.createReturn(
    data.borrow_id,
    data.return_condition,
    data.approved_by,
    data.notes,
  );

  if (!result) throw new Error("Failed to create return");
  return result;
};

export default {
  createReturn,
};
