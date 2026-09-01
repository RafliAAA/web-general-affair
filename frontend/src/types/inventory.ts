import type { HandoverItem } from "./handover";
import type { Maintenance } from "./maintenance";

export type AssetStatus = "Tersedia" | "Dipinjam" | "Diperbaiki" | "Diserahkan";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "cancelled" | "in-progress" | "completed" | "on-hold";

export interface Asset {
  asset_id: string;
  asset_code: string;        
  asset_name: string;
  serial_number: string;
  asset_category_id?: string | null;
  asset_category?: AssetCategory | null;
  status: AssetStatus;
  condition: string;         
  purchase_date: string | null;  
  warranty_date: string | null;
  photo: string | null;         
  specification: string | null; 
  createdAt: string;             
  updatedAt: string;      
  borrow: Borrow[];       

  maintenances?: Maintenance[]; 
  handoverItems?: HandoverItem[];  
}

export interface AssetCategory {
  asset_category_id: string;
  category_name: string;
  category_code: string;
}

export interface Borrow {
  borrow_id: string;
  user_id: string;
  asset_id: string;
  borrow_reason: string;
  borrow_date: string;
  expected_return_date: string | null;
  status: string;
  approved_by: string | null;
  createdAt: string;
  // TAMBAHKAN 3 BARIS INI
  recipient_type: "Personal" | "Divisi";
  directorate_id: string | null;

  asset?: {                      
    asset_name: string;
    asset_code: string;
    asset_category?: {
      category_name: string;
    } | null;
  };
  user?: {
    profile?: {
      name: string;
    };
  } | null;
  approver?: {
    profile?: {
      name: string;
    } | null;
  } | null;
  returns?: {
    return_id: string;
    return_condition: string;
    return_date: string;
    notes: string | null;
  }[];
}

export interface BorrowedAsset extends Asset {
  borrowedBy: string;
  borrowedByName: string;
  borrowDate: Date;
  returnDate?: Date;
}

export interface BorrowRequest {
  id: string;
  assetId: string;
  assetName: string;
  requestedBy: string;
  requestedByName: string;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  status: RequestStatus;
  reason: string;
}


export interface Projects {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus
  priority: "low" | "medium" | "high";
}

export interface AssetDetail extends Asset {
  borrow: Borrow[];
}


