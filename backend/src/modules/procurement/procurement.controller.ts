import procurementService from "./procurement.service";
import {
  CreateProcurementSchema,
  UpdateProcurementSchema,
} from "./procurement.dto";
import { Request, Response } from "express";

const createProcurement = async (req: Request, res: Response) => {
  try {
    const data = CreateProcurementSchema.parse(req.body);
    const result = await procurementService.createProcurement(data);

    return res.status(201).json({
      success: true,
      message: "Procurement created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create procurement",
      error: (error as Error).message,
    });
  }
};

const getAllProcurements = async (req: Request, res: Response) => {
  try {
    const result = await procurementService.getAllProcurements();

    return res.status(200).json({
      success: true,
      message: "Procurements fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get procurements",
      error: (error as Error).message,
    });
  }
};

const getProcurementById = async (req: Request, res: Response) => {
  try {
    const { procurement_id } = req.params;

    if (!procurement_id) {
      return res.status(400).json({
        success: false,
        message: "Procurement ID is required",
      });
    }

    const result = await procurementService.getProcurementById(procurement_id);

    return res.status(200).json({
      success: true,
      message: "Procurement retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve procurement",
      error: (error as Error).message,
    });
  }
};

const updateProcurement = async (req: Request, res: Response) => {
  try {
    const { procurement_id } = req.params;

    if (!procurement_id) {
      return res.status(400).json({
        success: false,
        message: "Procurement ID is required",
      });
    }

    const data = UpdateProcurementSchema.parse(req.body);
    const result = await procurementService.updateProcurement(
      procurement_id,
      data,
    );

    return res.status(200).json({
      success: true,
      message: "Procurement updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update procurement",
      error: (error as Error).message,
    });
  }
};

const deleteProcurement = async (req: Request, res: Response) => {
  try {
    const { procurement_id } = req.params;

    if (!procurement_id) {
      return res.status(400).json({
        success: false,
        message: "Procurement ID is required",
      });
    }

    const result = await procurementService.deleteProcurement(procurement_id);

    return res.status(200).json({
      success: true,
      message: "Procurement and its items deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete procurement",
      error: (error as Error).message,
    });
  }
};



export default {
  createProcurement,
  getAllProcurements,
  getProcurementById,
  updateProcurement,
  deleteProcurement,
};
