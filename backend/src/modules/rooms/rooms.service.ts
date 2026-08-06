import roomRepository from "./rooms.repository";
import type {
  CreateRoomDTO,
  UpdateRoomDTO,
  CreateBookingDTO,
  ReviewBookingDTO,
} from "./rooms.dto";

const createRoom = async (data: CreateRoomDTO) => {
  const result = await roomRepository.createRoom(data);
  if (!result) throw new Error("Failed to create room");
  return result;
};

const getAllRooms = async () => {
  const result = await roomRepository.getAllRooms();
  if (!result) throw new Error("Failed to fetch rooms");
  return result;
};

const getRoomById = async (room_id: string) => {
  const result = await roomRepository.getRoomById(room_id);
  if (!result) throw new Error("Room not found");
  return result;
};

const updateRoom = async (room_id: string, data: UpdateRoomDTO) => {
  const result = await roomRepository.updateRoom(room_id, data);
  if (!result) throw new Error("Failed to update room");
  return result;
};

const deleteRoom = async (room_id: string) => {
  const result = await roomRepository.deleteRoom(room_id);
  if (!result) throw new Error("Failed to delete room");
  return result;
};

const getRoomSchedule = async (room_id: string, date?: string) => {
  const result = await roomRepository.getRoomSchedule(room_id, date);
  if (!result) throw new Error("Failed to fetch schedule");
  return result;
};

const createBooking = async (data: CreateBookingDTO, user_id: string) => {
  const result = await roomRepository.createBooking(data, user_id);
  if (!result) throw new Error("Failed to create booking");
  return result;
};

const getAllBookings = async () => {
  const result = await roomRepository.getAllBookings();
  if (!result) throw new Error("Failed to fetch bookings");
  return result;
};

const getBookingById = async (booking_id: string) => {
  const result = await roomRepository.getBookingById(booking_id);
  if (!result) throw new Error("Booking not found");
  return result;
};

const getBookingByUser = async (user_id: string) => {
  const result = await roomRepository.getBookingByUser(user_id);
  if (!result) throw new Error("Failed to fetch bookings");
  return result;
};

const reviewBooking = async (
  booking_id: string,
  reviewed_by: string,
  data: ReviewBookingDTO,
) => {
  const result = await roomRepository.reviewBooking(
    booking_id,
    reviewed_by,
    data,
  );
  if (!result) throw new Error("Failed to review booking");
  return result;
};

const cancelBooking = async (booking_id: string, user_id: string) => {
  const result = await roomRepository.cancelBooking(booking_id, user_id);
  if (!result) throw new Error("Failed to cancel booking");
  return result;
};

export default {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomSchedule,
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByUser,
  reviewBooking,
  cancelBooking,
};
