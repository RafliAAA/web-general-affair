import { Response } from "express";
import type { AuthRequest } from "../../middleware/auth";
import entityService from "./entity.service";
import { createEntitySchema } from "./entity.dto";

const createEntity = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createEntitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
    }

    const result = await entityService.createEntity(parsed.data);
    return res
      .status(201)
      .json({
        success: true,
        message: "Entity created successfully",
        data: result,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create entity",
        error: error.message,
      });
  }
};

const getAllEntities = async (req: AuthRequest, res: Response) => {
  try {
    const result = await entityService.getAllEntities();
    return res
      .status(200)
      .json({
        success: true,
        message: "Entities fetched successfully",
        data: result,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch entities",
        error: error.message,
      });
  }
};


// TAMBAHKAN INI: Update Entity
const updateEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Entity ID is required"
        })
    }

    const parsed = createEntitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    }

    const result = await entityService.updateEntity(id, parsed.data);
    return res.status(200).json({ success: true, message: "Entity updated successfully", data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update entity", error: error.message });
  }
};

// TAMBAHKAN INI: Delete Entity
const deleteEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

       if (!id) {
         return res.status(400).json({
           success: false,
           message: "Entity ID is required",
         });
       }

    await entityService.deleteEntity(id);
    return res.status(200).json({ success: true, message: "Entity deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete entity", error: error.message });
  }
};

export default {
  createEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
};