import express from "express"
import authMiddleware from "../../middleware/auth"
import bookingController from "./booking.controller";

const router = express.Router()


router.get(
  "/",
  authMiddleware.protectRoute,
  bookingController.getAllBookings,
);
router.get(
  "/me",
  authMiddleware.protectRoute,
  bookingController.getMyBookings,
);
router.get(
  "/:booking_id",
  authMiddleware.protectRoute,
  bookingController.getBookingById,
);
router.post(
  "/",
  authMiddleware.protectRoute,
  bookingController.createBooking,
);
router.patch(
  "/:booking_id/review",
  authMiddleware.protectRoute,
  bookingController.reviewBooking,
);
router.delete(
  "/:booking_id/cancel",
  authMiddleware.protectRoute,
  bookingController.cancelBooking,
);

export default router;