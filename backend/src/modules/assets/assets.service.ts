import assetsRepository from "./assets.repository";

const createAsset = async (data: {
  asset_name: string;
  asset_code: string;
  purchase_date: Date;
  warranty_date: Date;
  serial_number: string;
  asset_type: string;
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

export default {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getAvailableAssets,
  getBorrowedAssets,
};
