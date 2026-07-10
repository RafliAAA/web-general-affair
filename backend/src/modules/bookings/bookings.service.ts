import { CreateBookingDTO, ReviewBookingDTO } from "./bookings.dto";
import bookingsRepository from "./bookings.repository";

const createBooking = async (data: CreateBookingDTO, user_id: string) => {
  const result = await bookingsRepository.createBooking(data, user_id);
  if (!result) throw new Error("Failed to create booking");
  return result;
};

const getAllBookings = async () => {
  const result = await bookingsRepository.getAllBookings();
  if (!result) throw new Error("Failed to fetch bookings");
  return result;
};

const getBookingById = async (booking_id: string) => {
  const result = await bookingsRepository.getBookingById(booking_id);
  if (!result) throw new Error("Booking not found");
  return result;
};

const getBookingByUser = async (user_id: string) => {
  const result = await bookingsRepository.getBookingByUser(user_id);
  if (!result) throw new Error("Failed to fetch bookings");
  return result;
};

const reviewBooking = async (
  booking_id: string,
  reviewed_by: string,
  data: ReviewBookingDTO,
) => {
  const result = await bookingsRepository.reviewBooking(
    booking_id,
    reviewed_by,
    data,
  );
  if (!result) throw new Error("Failed to review booking");
  return result;
};

const cancelBooking = async (booking_id: string, user_id: string) => {
  const result = await bookingsRepository.cancelBooking(booking_id, user_id);
  if (!result) throw new Error("Failed to cancel booking");
  return result;
};

export default {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByUser,
  reviewBooking,
  cancelBooking,
};