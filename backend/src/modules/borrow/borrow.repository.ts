import prisma from "../../config/prisma";

const createBorrowRequest = async (data: any) => {
  return await prisma.borrow.create({
    data: data,
  });
};

const cancelBorrowRequest = async (borrow_id: string) => {
  return await prisma.borrow.delete({
    where: {
      borrow_id,
    }
  })
}

const getAllBorrowRequest = async () => {
  return await prisma.borrow.findMany({
    include: {
      asset: {
        select: {
          asset_name: true,
          serial_number: true,
          asset_type: true,
          location: true
        }
      }
    }
  });
}

const getBorrowRequestByUserId = async (user_id: string) => {
  return await prisma.borrow.findMany({
    where: {
      user_id,
    }
  });
};

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getBorrowRequestByUserId,
};
