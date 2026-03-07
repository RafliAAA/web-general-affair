import { AuthRequest } from "../../middleware/auth";
import borrowService from "./borrow.service";
import { Response } from "express";

const createBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const { asset_id } = req.params;
    const expected_return_date = req.body;

    const result = await borrowService.createBorrowRequest({
      asset_id,
      user_id,
      expected_return_date,
    });

    return res.status(201).json({
      success: true,
      message: "Borrow request created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error createBorrowRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create borrow request",
      error: error.message,
    });
  }
};

const cancelBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { borrow_id } = req.params;

    if (!borrow_id) {
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required",
      });
    }

    const result = await borrowService.cancelBorrowRequest(borrow_id);

    return res.status(200).json({
      success: true,
      message: "Borrow request canceled successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error cancelBorrowRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel borrow request",
      error: error.message,
    });
  }
};

const getAllBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const result = await borrowService.getAllBorrowRequest();

    return res.status(200).json({
      success: true,
      message: "Borrow requests retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error getAllBorrowRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve borrow requests",
      error: error.message,
    });
  }
};

const getBorrowRequestByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if(!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    const result = await borrowService.getBorrowRequestByUserId(user_id);

    return res.status(200).json({
      success: true,
      message: "Borrow requests retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error getBorrowRequestByUserId:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve borrow requests",
      error: error.message,
    });
  }
};

export default {
  createBorrowRequest,
  cancelBorrowRequest,
  getAllBorrowRequest,
  getBorrowRequestByUserId
};
