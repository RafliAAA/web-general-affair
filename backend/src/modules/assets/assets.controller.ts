import { AuthRequest } from "../../middleware/auth";
import assetsService from "./assets.service";
import { Request, Response } from "express";

const createAsset = async (req: Request, res: Response) => {
  try {
    const {
      asset_name,
      asset_code,
      purchase_date,
      warranty_date,
      serial_number,
      asset_category_id,
      condition,
      status,
    } = req.body;
    const assets = await assetsService.createAsset({
      asset_name,
      asset_code,
      purchase_date: new Date(purchase_date),
      warranty_date: new Date(warranty_date),
      serial_number,
      asset_category_id,
      condition,
      status,
    });
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
    const {
      search,
      status,
      asset_type,
      page = "1",
      limit = "10",
    } = req.query;

    const result = await assetsService.getAllAssets({
      search,
      status,
      asset_type,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      message: "Assets fetched successfully",
      data: result.data,   
      meta: result.meta,   
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

const getAvailableAssets = async (req: Request, res: Response) => {
  try {
    const assets = await assetsService.getAvailableAssets();

    return res.status(200).json({
      success: true,
      message: "Available assets fetched successfully",
      data: assets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch available assets",
      error: error.message,
    });
  }
};

const getBorrowedAssets = async (req: Request, res: Response) => {
  try {
    const assets = await assetsService.getBorrowedAssets();

    return res.status(200).json({
      success: true,
      message: "Borrowed assets fetched successfully",
      data: assets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrowed assets",
      error: error.message,
    });
  }
};

const getMyAssets = async (req: AuthRequest, res: Response ) => {
  try {
    const user_id = req.user?.user_id;

    const excludeMaintenance = req.query.excludeMaintenance === "true"
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    const result = await assetsService.getMyAssets(user_id, excludeMaintenance)

    return res.status(200).json({
      success: true,
      message: "My assets fetched successfully",
      data: result
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch my assets",
      error: error.message,
    });
  }
}

const findAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await assetsService.findAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const findCategoryById = async (req: Request, res: Response) => {
  try {
    const { asset_category_id } = req.params;

     if (!asset_category_id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      })
    }

    const result = await assetsService.findCategoryById(asset_category_id);

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const { category_name, category_code } = req.body;

    const result = await assetsService.createCategory({ category_name, category_code });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { asset_category_id } = req.params;

    const { category_name, category_code } = req.body;

     if (!asset_category_id) {
       return res.status(400).json({
         success: false,
         message: "Category ID is required",
       });
     }

    const result = await assetsService.updateCategory(asset_category_id, { category_name, category_code });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
}

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { asset_category_id } = req.params;

    if (!asset_category_id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      })
    }

    const result = await assetsService.deleteCategory(asset_category_id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
}

export default {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getAvailableAssets,
  getBorrowedAssets,
  getMyAssets,
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
