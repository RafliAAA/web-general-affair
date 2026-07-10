export interface RoomFacility {
  facility_id: string;
  room_id: string;
  name: string;
}

export interface Room {
  room_id: string;
  name: string;
  capacity: number;
  location: string;
  status: "Tersedia" | "TidakTersedia";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  facilities: RoomFacility[];
}

export interface RoomListResponse {
  success: boolean;
  message: string;
  data: Room[];
}

export interface RoomResponse {
  success: boolean;
  message: string;
  data: Room;
}

export interface CreateRoomPayload {
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
}

export interface UpdateRoomPayload {
  name?: string;
  capacity?: number;
  location?: string;
  facilities?: string[];
  status?: "Tersedia" | "Tidak Tersedia";
}