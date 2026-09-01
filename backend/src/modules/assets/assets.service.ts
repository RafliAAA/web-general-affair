import assetsRepository from "./assets.repository";

const createAsset = async (data: {
  asset_name: string;
  asset_code: string;
  purchase_date: Date;
  warranty_date: Date;
  serial_number: string;
  asset_category_id: string;
  condition: string;
  status: string;

}) => {
  const assets = await assetsRepository.createAsset(
    data,
  );

  if (!assets) throw new Error("Asset not found");
  return assets;
};

const getAllAssets = async (filter: any) => {
  const assets = await assetsRepository.findAllAssets(filter);

  if (!assets) throw new Error("Asset not found");
  return assets;
};

const getAssetById = async (asset_id: string) => {
  const asset = await assetsRepository.findAssetById(asset_id);

  if (!asset) throw new Error("Asset not found");
  return asset;
};

const updateAsset = async (asset_id: string, data: any) => {
  const assets = await assetsRepository.updateAsset(asset_id, data);
  if (!assets) throw new Error("Failed to update asset");
  return assets;
};

const deleteAsset = async (asset_id: string) => {
  const asset = await assetsRepository.deleteAsset(asset_id);
  if (!asset) throw new Error("Failed to delete asset");
  return asset;
};

const getAvailableAssets = async () => {
  const assets = await assetsRepository.getAvailableAssets();
  if (!assets) throw new Error("No available assets found");
  return assets;
};

const getBorrowedAssets = async () => {
  const assets = await assetsRepository.getBorrowedAssets();
  if (!assets) throw new Error("No borrowed assets found");
  return assets;
};

const getMyAssets = async(user_id: string, excludeMaintenance: boolean) => {
  const assets = await assetsRepository.getMyAssets(user_id, excludeMaintenance)

  if(!assets) throw new Error("No assets found for this user")
  return assets
}

const getBorrowableAssets = async () => {
  const result = await assetsRepository.getBorrowableAssets();
  if (!result) throw new Error("Failed to fetch borrowable assets");
  return result;
};

const findAllCategories = async () => {
  const categories = await assetsRepository.findAllCategories();
  if (!categories) throw new Error("No categories found");
  return categories;
}

const findCategoryById = async (asset_category_id: string) => {
  const category = await assetsRepository.findCategoryById(asset_category_id);
  if (!category) throw new Error("Category not found");
  return category;
}

const createCategory = async (data: { category_name: string; category_code: string }) => {
  const category = await assetsRepository.createCategory(data);
  if (!category) throw new Error("Failed to create category");
  return category;
}

const updateCategory = async (asset_category_id: string, data: { category_name?: string; category_code?: string }) => {
  const category = await assetsRepository.updateCategory(asset_category_id, data);
  if (!category) throw new Error("Failed to update category");
  return category;
}

const deleteCategory = async (asset_category_id: string) => {
  const category = await assetsRepository.deleteCategory(asset_category_id);
  if (!category) throw new Error("Failed to delete category");
  return category;
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
  getBorrowableAssets,
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
