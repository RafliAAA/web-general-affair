import api from "@/lib/axios";

export interface AssetCategory {
  asset_category_id: string;
  category_name: string;
  category_code: string;
  _count?: { assets: number };
}

export const getCategories = async (): Promise<AssetCategory[]> => {
  const res = await api.get("/assets/categories"); // Sesuaikan endpoint-nya
  return res.data.data || res.data;
};

export const createCategory = async (data: {
  category_name: string;
  category_code: string;
}) => {
  const res = await api.post("/assets/categories", data);
  return res.data.data;
};

export const updateCategory = async (
  id: string,
  data: { category_name?: string; category_code?: string },
) => {
  const res = await api.patch(`/assets/categories/${id}`, data);
  return res.data.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/assets/categories/${id}`);
  return res.data.data;
};
