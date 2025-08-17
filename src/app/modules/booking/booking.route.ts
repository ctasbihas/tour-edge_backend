import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { BookingControllers } from "./booking.controller";
import { createBookingSchema, updateBookingSchema } from "./booking.validation";

const router = Router();

router.post(
	"/",
	checkAuth(...Object.values(UserRole)),
	validateRequest(createBookingSchema),
	BookingControllers.createBooking
);
router.get(
	"/my-bookings",
	checkAuth(...Object.values(UserRole)),
	BookingControllers.getMyBookings
);
router.get(
	"/",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	BookingControllers.getAllBookings
);
router.get(
	"/:bookingId",
	checkAuth(...Object.values(UserRole)),
	BookingControllers.getBookingById
);
router.patch(
	"/:bookingId/status",
	checkAuth(...Object.values(UserRole)),
	validateRequest(updateBookingSchema),
	BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;
