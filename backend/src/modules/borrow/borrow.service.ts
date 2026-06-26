import { CreateBorrowInput } from "./borrow.dto";
import borrowRepository from "./borrow.repository";

const createBorrowRequest = async (data: CreateBorrowInput) => {
  const borrow = await borrowRepository.createBorrowRequest(data);

  if (!borrow) throw new Error("Failed to create borrow request");

  return borrow;
};

const cancelBorrowRequest = async (user_id:string, borrow_id: string) => {
  const borrow = await borrowRepository.cancelBorrowRequest(user_id, borrow_id);

  if (!borrow) throw new Error("Failed to delete borrow request");
  return borrow;
};

const getAllBorrowRequest = async () => {
  const borrows = await borrowRepository.getAllBorrowRequest();

  if (!borrows) throw new Error("Failed to get borrow request");
  return borrows;
};

const getAllActiveBorrow = async () => {
  const result = await borrowRepository.getAllActiveBorrow();

  if (!result) throw new Error("Failed to fetch active borrows");
  return result;
};

const getBorrowRequestByUserId = async (user_id: string) => {
  const borrows = await borrowRepository.getBorrowRequestByUserId(user_id);

  if (!borrows) throw new Error("Failed to get borrow request by user ID");
  return borrows;
};

const getMyBorrows = async (user_id: string) => {
  const borrows = await borrowRepository.getMyBorrows(user_id);

  if (!borrows) throw new Error("Failed to get my borrows");

  return borrows;
};

const approveBorrowRequest = async (borrow_id: string, approved_by: string) => {
  const borrow = await borrowRepository.approveBorrowRequest(borrow_id, approved_by);

  if (!borrow) throw new Error("Failed to approve borrow request");

  return borrow;
};

const rejectBorrowRequest= async( borrow_id: string, approved_by: string) => {
  const borrow = await borrowRepository.rejectBorrowRequest(borrow_id, approved_by);

  if (!borrow) throw new Error("Failed to reject borrow request")

    return borrow
}

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getAllActiveBorrow,
  getBorrowRequestByUserId,
  getMyBorrows,
  approveBorrowRequest,
  rejectBorrowRequest,
};
