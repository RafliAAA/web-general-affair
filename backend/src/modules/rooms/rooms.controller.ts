import { Response } from "express";
import roomService from "./rooms.service";
import {
  createRoomSchema,
  updateRoomSchema,
  createBookingSchema,
  reviewBookingSchema,
} from "./rooms.dto";
import type { AuthRequest } from "../../middleware/auth";

// ─── Room ─────────────────────────────────────────────────────────────────────

const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await roomService.createRoom(parsed.data);
    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message,
    });
  }
};

const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const result = await roomService.getAllRooms();
    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

const getRoomById = async (req: AuthRequest, res: Response) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const result = await roomService.getRoomById(room_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Room fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const parsed = updateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await roomService.updateRoom(room_id, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update room",
      error: error.message,
    });
  }
};

const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const result = await roomService.deleteRoom(room_id);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message,
    });
  }
};

const getRoomSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const { date } = req.query;
    const result = await roomService.getRoomSchedule(
      room_id,
      date as string | undefined,
    );
    return res.status(200).json({
      success: true,
      message: "Schedule fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch schedule",
      error: error.message,
    });
  }
};

// ─── Booking ──────────────────────────────────────────────────────────────────

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

    const result = await roomService.createBooking(parsed.data, user_id);
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
    const result = await roomService.getAllBookings();
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

    const result = await roomService.getBookingById(booking_id);
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

    const result = await roomService.getBookingByUser(user_id);
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

    const result = await roomService.reviewBooking(
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

    await roomService.cancelBooking(booking_id, user_id);
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
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomSchedule,
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  reviewBooking,
  cancelBooking,
};
