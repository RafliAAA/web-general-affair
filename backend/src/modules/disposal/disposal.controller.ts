import { Request, Response } from "express";
import { CreateDisposalSchema } from "./disposal.dto";
import disposalService from "./disposal.service";

const createDisposal = async (req: Request, res: Response) => {
  try {
    const data = await CreateDisposalSchema.parse(req.body);
    const result = await disposalService.createDisposal(data);

    return res.status(200).json({
      success: true,
      message: "Disposal successfully created",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Disposal failed to create",
      error: (error as Error).message,
    });
  }
};

const getAllDisposals = async (req: Request, res: Response) => {
  try {
    const result = await disposalService.getAllDisposals();

    return res.status(200).json({
      success: true,
      message: "Disposal fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetched disposal",
      error: (error as Error).message,
    });
  }
};

const getDisposalById = async (req: Request, res: Response) => {
  try {
    const { disposal_id } = req.params;

    if (!disposal_id) {
      return res.status(404).json({
        success: false,
        message: "Disposal ID is required",
      });
    }

    const result = await disposalService.getDisposalById(disposal_id);

    return res.status(200).json({
      success: true,
      message: "Disposal fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetched disposal",
      error: (error as Error).message,
    });
  }
};

const updateDisposal = async (req: Request, res: Response) => {
  try {
    const { disposal_id } = req.params;

    if (!disposal_id) {
      return res.status(400).json({
        success: false,
        message: "Disposal ID is required",
      });
    }
    console.log("body:", req.body);

    const data = await CreateDisposalSchema.parse(req.body);
    const result = await disposalService.updateDisposal(disposal_id, data);

    return res.status(201).json({
      success: true,
      message: "Disposal updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update disposal",
      error: (error as Error).message,
    });
  }
};

const deleteDisposal = async (req: Request, res: Response) => {
  try {
    const { disposal_id } = req.params;

    if (!disposal_id) {
      return res.status(404).json({
        success: false,
        message: "Disposal ID is required",
      });
    }

    const result = await disposalService.deleteDisposal(disposal_id);

    return res.status(200).json({
      success: true,
      message: "Disposal deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete disposal",
      error: (error as Error).message,
    });
  }
};

export default {
  createDisposal,
  getAllDisposals,
  getDisposalById,
  updateDisposal,
  deleteDisposal,
};
