import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as JwtPayload;
	const result = await BookingServices.createBooking(req.body, user._id);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Booking created successfully",
		data: result,
	});
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as JwtPayload;
	const result = await BookingServices.getMyBookings(user._id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "My bookings retrieved successfully",
		data: result,
	});
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
	const result = await BookingServices.getAllBookings();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Bookings retrieved successfully",
		data: result,
	});
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
	const result = await BookingServices.getBookingById();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Booking retrieved successfully",
		data: result,
	});
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
	const result = await BookingServices.updateBookingStatus();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Booking status updated successfully",
		data: result,
	});
});

export const BookingControllers = {
	createBooking,
	getMyBookings,
	getAllBookings,
	getBookingById,
	updateBookingStatus,
};
