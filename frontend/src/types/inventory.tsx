export type AssetStatus = "available" | "borrowed" | "maintenance";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "cancelled" | "in-progress" | "completed" | "on-hold";

export interface Asset {
  asset_id: string;
  asset_name: string;
  serial_number: string;
  asset_type: string;
  status: AssetStatus;
  location: string;
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
