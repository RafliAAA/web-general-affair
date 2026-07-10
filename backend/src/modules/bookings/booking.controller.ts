import  { Response } from "express"
import { AuthRequest } from "../../middleware/auth";
import { createBookingSchema, reviewBookingSchema } from "./bookings.dto";
import bookingsService from "./bookings.service";

const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await bookingsService.createBooking(parsed.data, user_id);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const result = await bookingsService.getAllBookings();
    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id } = req.params;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const result = await bookingsService.getBookingById(booking_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await bookingsService.getBookingByUser(user_id);
    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const reviewBooking = async (req: AuthRequest, res: Response) => {
  try {
    const reviewed_by = req.user?.user_id;
    if (!reviewed_by) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { booking_id } = req.params;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const parsed = reviewBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await bookingsService.reviewBooking(
      booking_id,
      reviewed_by,
      parsed.data,
    );
    return res.status(200).json({
      success: true,
      message: "Booking reviewed successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const {booking_id} = req.params;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await bookingsService.cancelBooking(booking_id, user_id);
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  reviewBooking,
  cancelBooking,
};