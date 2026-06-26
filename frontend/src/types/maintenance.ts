export interface MaintenanceAsset {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  asset_type: string;
  condition: string;
  status: string;
}

export interface MaintenanceUser {
  user_id: string;
  profile: { name: string | null } | null;
}

export interface Maintenance {
  maintenance_id: string;
  asset_id: string;
  reported_by: string;
  description: string;
  status: string;
  verified_by: string | null;
  rejection_reason: string | null;
  verified_at: string | null;
  taken_by: string | null;
  taken_at: string | null;
  resolution_notes: string | null;
  completed_at: string | null;
  createdAt: string;
  updatedAt: string;
  asset: MaintenanceAsset;
  reporter: MaintenanceUser;
  verifier: MaintenanceUser | null;
  handler: MaintenanceUser | null;
}

export interface CreateMaintenancePayload {
  asset_id: string;
  description: string;
}


export interface BorrowResponse {
  asset_id: string;
  status: string;
  asset: {
    asset_name: string;
    asset_type: string;
  };
}

export interface MaintenanceResponse {
  asset_id: string;
  status: string;
}

export interface BorrowedAsset {
  asset_id: string;
  asset_name: string;
  asset_type: string;
}

export interface ActualizationForm {
  actualization_id: string;
  maintenance_id: string;
  form_number: string;
  user_name: string;
  form_date: string;
  duration_minutes: number;
  description: string;
  issue: string;
  handling: string;
  recommendation: string;
  createdAt: string;
}

export interface CannotRepairPayload {
  form_number: string;
  description: string;
  issue: string;
  handling: string;
  recommendation: string;
}