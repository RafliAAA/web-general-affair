import borrowRepository from "./borrow.repository";

const createBorrowRequest = async (data: any) => {
  console.log("Data masuk ke service:", data);
  const borrow = await borrowRepository.createBorrowRequest(data);
  console.log("Data masuk ke service:", data);

  if (!borrow) throw new Error("Failed to create borrow request");

  return borrow;
};

const cancelBorrowRequest = async (borrow_id: string) => {
  const borrow = await borrowRepository.cancelBorrowRequest(borrow_id);

  if (!borrow) throw new Error("Failed to delete borrow request");
  return borrow;
};

const getAllBorrowRequest = async () => {
  const borrows = await borrowRepository.getAllBorrowRequest();

  if(!borrows) throw new Error("Failed to get borrow request")
  return borrows;
};

const getBorrowRequestByUserId = async (user_id: string) => {
  const borrows = await borrowRepository.getBorrowRequestByUserId(user_id);

  if(!borrows) throw new Error("Failed to get borrow request by user ID");
  return borrows;
};

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getBorrowRequestByUserId
};
