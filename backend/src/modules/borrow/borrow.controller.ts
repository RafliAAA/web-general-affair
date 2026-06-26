import { AuthRequest } from "../../middleware/auth";
import { CreateBorrowSchema } from "./borrow.dto";
import borrowService from "./borrow.service";
import { Response } from "express";

const createBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if(!user_id) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      })
    }

    const data = CreateBorrowSchema.parse(req.body)

    const result = await borrowService.createBorrowRequest({
      user_id,
      ...data,
    
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
    const user_id = req.user?.user_id

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      })
    }
    const { borrow_id } = req.params;

    if (!borrow_id) {
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required",
      });
    }

    const result = await borrowService.cancelBorrowRequest(user_id, borrow_id);

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

const getAllActiveBorrow = async (req: AuthRequest, res: Response) => {
  try {
    const result = await borrowService.getAllActiveBorrow();
    return res.status(200).json({
      success: true,
      message: "Active borrow requests retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active borrows",
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

const getMyBorrows = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if(!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    const result = await borrowService.getMyBorrows(user_id)

    return res.status(200).json({
      success: true,
      message: "My borrows retrieved successfully",
      data: result,
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve my borrows",
      error: error.message,
    })
  }
}

const approveBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { borrow_id } = req.params;
    const approved_by = req.user?.user_id;

    if(!approved_by){
      return res.status(400).json({
        success: false,
        message: "Approver ID is required"
      })
    }

    if(!borrow_id) {
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required"
      })
    }

    const result = await borrowService.approveBorrowRequest(borrow_id, approved_by);

    return res.status(200).json({
      success: true,
      message: "Borrow request approved successfully",
      data: result,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve borrow request",
      error: error.message,
    })
  }
}

const rejectBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { borrow_id } = req.params;
    const approved_by = req.user?.user_id;

    if(!approved_by){
      return res.status(400).json({
        success: false,
        message: "Approver ID is required"
      })
    }

    if(!borrow_id){
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required"
      })
    }

    const result = await borrowService.rejectBorrowRequest(borrow_id, approved_by)

    return res.status(200).json({
      success: true,
      message: "Borrow request rejected successfully",
      data: result
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject borrow request",
      error: error.message,
    })
  }
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
