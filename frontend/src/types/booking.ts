export interface BookingRoom {
  room_id: string;
  name: string;
  capacity: number;
  location: string;
  status: string;
  facilities: { facility_id: string; room_id: string; name: string }[];
}

export interface Booking {
  booking_id: string;
  room_id: string;
  user_id: string;
  reviewed_by: string | null;
  purpose: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "Dibatalkan";
  reject_notes: string | null;
  createdAt: string;
  updatedAt: string;
  room: BookingRoom;
  user: {
    profile: {
      name: string;
      entity: {
        entity_name: string;
      };
      directorate: {
        directorate_name: string;
      };
    };
  };
  reviewer: { profile: { name: string } } | null;
}

export interface CreateBookingPayload {
  room_id: string;
  purpose: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ReviewBookingPayload {
  status: "Disetujui" | "Ditolak";
  reject_notes?: string;
}
