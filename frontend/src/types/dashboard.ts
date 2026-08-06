export interface AssetStats {
  tersedia: number;
  dipinjam: number;
  diperbaiki: number;
  diserahkan: number;
  dihapus: number;
  total: number;
}

export interface BorrowStats {
  menunggu: number;
  disetujui: number;
  ditolak: number;
  dibatalkan: number;
  dikembalikan: number;
  total: number;
}

export interface MaintenanceStats {
  menungguVerifikasi: number;
  menungguDikerjakan: number;
  sedangDikerjakan: number;
  selesai: number;
  ditolak: number;
  tidakDapatDiperbaiki: number;
  total: number;
}

export interface RecentBorrow {
  borrow_id: string;
  user_id: string;
  asset_id: string;
  borrow_reason: string;
  borrow_date: string;
  expected_return_date: string;
  status: string;
  approved_by: string | null;
  createdAt: string;
  asset: {
    asset_name: string;
    asset_code: string;
  };
  user: {
    profile: {
      name: string;
    };
  };
}

export interface RecentMaintenance {
  maintenance_id: string;
  asset_id: string;
  reported_by: string;
  description: string;
  status: string;
  createdAt: string;
  asset: {
    asset_name: string;
    asset_code: string;
  };
  reporter: {
    profile: {
      name: string;
    };
  };
}

export interface DashboardData {
  assets: AssetStats;
  borrows: BorrowStats;
  maintenance: MaintenanceStats;
  procurement: { total: number };
  disposal: { total: number };
  handover: { aktif: number };
  recentActivity: {
    borrows: RecentBorrow[];
    maintenance: RecentMaintenance[];
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}