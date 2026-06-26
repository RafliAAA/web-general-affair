import { Request, Response } from "express";
import handoverService from "./handover.service";
import { createHandoverSchema, returnHandoverSchema } from "./handover.dto";
import type { AuthRequest } from "../../middleware/auth";

const createHandover = async (req: AuthRequest, res: Response) => {
  try {
    const created_by = req.user?.user_id;
    if (!created_by) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsed = createHandoverSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await handoverService.createHandover(
      parsed.data,
      created_by,
    );
    return res.status(201).json({
      success: true,
      message: "Handover created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create handover",
      error: error.message,
    });
  }
};

const getAllHandover = async (req: Request, res: Response) => {
  try {
    const result = await handoverService.getAllHandover();
    return res.status(200).json({
      success: true,
      message: "Handovers fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch handovers",
      error: error.message,
    });
  }
};

const getHandoverById = async (req: Request, res: Response) => {
  try {
    const { handover_id } = req.params;

    if (!handover_id) {
      return res.status(400).json({
        success: false,
        message: "Handover ID is required",
      });
    }

    const result = await handoverService.getHandoverById(handover_id);
    return res.status(200).json({
      success: true,
      message: "Handover fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch handover",
      error: error.message,
    });
  }
};

const getMyHandover = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await handoverService.getHandoverByUser(user_id);
    return res.status(200).json({
      success: true,
      message: "Handovers fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch handovers",
      error: error.message,
    });
  }
};

const returnHandover = async (req: AuthRequest, res: Response) => {
  try {
    const returned_by = req.user?.user_id;

    if (!returned_by) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { handover_id } = req.params;

    if (!handover_id) {
      return res.status(400).json({
        success: false,
        message: "Handover ID is required",
      });
    }

    const parsed = returnHandoverSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await handoverService.returnHandover(
      handover_id,
      returned_by,
      parsed.data,
    );
    return res.status(200).json({
      success: true,
      message: "Handover returned successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to process return",
      error: error.message,
    });
  }
};

export default {
  createHandover,
  getAllHandover,
  getHandoverById,
  getMyHandover,
  returnHandover,
};
