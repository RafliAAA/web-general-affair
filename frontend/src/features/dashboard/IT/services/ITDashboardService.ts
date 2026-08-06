import api from "@/lib/axios";

// Tipe data untuk list maintenance di IT Dashboard
export interface ITMaintenanceItem {
  maintenance_id: string;
  status: string;
  description: string;
  createdAt: string;
  asset: {
    asset_name: string;
    asset_code: string;
  };
  reporter: {
    profile: {
      name: string | null;
    } | null;
  } | null;
}

// Tipe data untuk grafik tren bulanan
export interface MonthlyTrendItem {
  month: string;
  count: number;
}

// Tipe data utama IT Dashboard
export interface ITDashboardData {
  maintenance: {
    menungguVerifikasi: number;
    menungguDikerjakan: number;
    sedangDikerjakan: number;
    selesai: number;
    tidakDapatDiperbaiki: number;
    total: number;
  };
  recentActivity: {
    maintenance: ITMaintenanceItem[];
  };
  // TAMBAHKAN PROPERTI INI:
  monthlyTrend: MonthlyTrendItem[];
}

export const getITDashboard = async (): Promise<ITDashboardData> => {
  const res = await api.get("/dashboard/it");
  return res.data.data;
};
