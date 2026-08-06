import { Response } from "express";
import type { AuthRequest } from "../../middleware/auth";
import directorateService from "./directorate.service";
import { createDirectorateSchema } from "./directorate.dto";

const createDirectorate = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createDirectorateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
    }

    const result = await directorateService.createDirectorate(parsed.data);
    return res
      .status(201)
      .json({
        success: true,
        message: "Directorate created successfully",
        data: result,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create directorate",
        error: error.message,
      });
  }
};

const getAllDirectorates = async (req: AuthRequest, res: Response) => {
  try {
    const entity_id = req.query.entity_id as string | undefined;
    const result = await directorateService.getAllDirectorates(entity_id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Directorates fetched successfully",
        data: result,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch directorates",
        error: error.message,
      });
  }
};
const updateDirectorate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Directorate ID is required"
        })
    }

    const parsed = createDirectorateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
    }

    const result = await directorateService.updateDirectorate(id, parsed.data);
    return res
      .status(200)
      .json({
        success: true,
        message: "Directorate updated successfully",
        data: result,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update directorate",
        error: error.message,
      });
  }
};

const deleteDirectorate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    
    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Directorate ID is required"
        })
    }

    await directorateService.deleteDirectorate(id);
    return res
      .status(200)
      .json({ success: true, message: "Directorate deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete directorate",
        error: error.message,
      });
  }
};

export default {
  createDirectorate,
  getAllDirectorates,
  updateDirectorate,
  deleteDirectorate,
};
