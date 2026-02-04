import assetsService from "./assets.service";
import { Request, Response } from "express";

const createAsset = async (req: Request, res: Response) => {
  try {
    const { asset_name, serial_number, asset_type, status, location } =
      req.body;
    const assets = await assetsService.createAsset(
      asset_name,
      serial_number,
      asset_type,
      status,
      location,
    );
    return res.status(201).json({
      success: true,
      message: "Asset created Successfully",
      data: assets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create assets",
      error: error.message,
    });
  }
};

const getAllAssets = async (req: Request, res: Response) => {
  try {
    const filter = req.query;
    const assets = await assetsService.getAllAssets(filter);
    return res.status(200).json({
      success: true,
      message: "Assets fetched successfully",
      data: assets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assets",
      error: error.message,
    });
  }
};

const getAssetById = async (req: Request, res: Response) => {
  try {
    const { asset_id } = req.params;

    if (!asset_id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }
    const asset = await assetsService.getAssetById(asset_id);

    return res.status(200).json({
      success: true,
      message: "Asset fetched successfully",
      data: asset,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch asset",
      error: error.message,
    });
  }
};

const updateAsset = async (req: Request, res: Response) => {
  try {
    const { asset_id } = req.params;
    const data = req.body;

    if (!asset_id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    const updatedAsset = await assetsService.updateAsset(asset_id, data);

    return res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      data: updatedAsset,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update asset",
      error: error.message,
    });
  }
};

const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { asset_id } = req.params;

    if (!asset_id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    const asset = await assetsService.deleteAsset(asset_id);

    return res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
      data: asset,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete asset",
      error: error.message,
    });
  }
};

export default {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};
