export type AssetStatus = "Tersedia" | "Dipinjam" | "maintenance";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "cancelled" | "in-progress" | "completed" | "on-hold";


export interface Asset {
 asset_id: string;
  asset_code: string;        
  asset_name: string;
  serial_number: string;
  asset_type: string;
  status: AssetStatus;
  condition: string;         
  purchase_date: string | null;  
  warranty_date: string | null;
  photo: string | null;         
  createdAt: string;             
  updatedAt: string;      
  borrow: Borrow[];        
}

export interface Borrow {
  borrow_id: string;
  user_id: string;
  asset_id: string;
  borrow_reason: string;
  expected_return_date: string | null;
  status: string;
  approved_by: string | null;
  createdAt: string;
  user?: {
    profile?: {
      name: string;
    };
  };
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

export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
}

export interface RoomBooking  {
  id: string;
  roomId: string;
  roomName: string;
  bookedBy: string;
  bookedByName: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  status: RequestStatus;
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


