import api from "@/lib/axios";

// Tipe data untuk Recent Activity (sesuaikan dengan kebutuhan komponen UI kamu)
export interface RecentBorrow {
  borrow_id: string;
  status: string;
  borrow_date: string;
  createdAt: string;
  asset: {
    asset_name: string;
    asset_code: string;
  };
}

export interface RecentMaintenance {
  maintenance_id: string;
  status: string;
  description: string;
  createdAt: string;
  asset: {
    asset_name: string;
    asset_code: string;
  };
}

// Tipe data utama untuk User Dashboard
export interface UserDashboardData {
  myAssets: {
    aktif: number;
  };
  myBorrows: {
    menunggu: number;
    disetujui: number;
    dikembalikan: number;
    total: number;
  };
  myMaintenance: {
    proses: number;
    selesai: number;
    total: number;
  };
  recentActivity: {
    borrows: RecentBorrow[];
    maintenance: RecentMaintenance[];
  };
}

export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const res = await api.get("/dashboard/me");
  return res.data.data;
};
