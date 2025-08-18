import { randomBytes } from "crypto";
import AppError from "../../errorHelpers/AppError";
import { Payment } from "../payment/payment.model";
import { SSLServices } from "../ssl/ssl.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

export const generateTransactionId = () => {
	const ts = Date.now().toString(36);
	const rand = randomBytes(10).toString("hex");
	return `trans_${ts}_${rand}`;
};

const createBooking = async (bookingData: IBooking, userId: string) => {
	const transactionId = generateTransactionId();

	const user = await User.findById(userId).select("phone address");
	if (!user?.phone || !user.address) {
		throw new Error("User phone and address are required");
	}
	const tour = await Tour.findById(bookingData.tour).select("costFrom");
	if (!tour) {
		throw new AppError(404, "Tour not found");
	}
	if (!tour.costFrom) {
		throw new AppError(400, "Tour cost is required");
	}

	const session = await Booking.startSession();
	session.startTransaction();

	try {
		const amount = tour.costFrom * bookingData.guestCount;

		const booking = await Booking.create(
			[
				{
					user: user.id,
					tour: tour.id,
					guestCount: bookingData.guestCount,
				},
			],
			{ session }
		);

		const payment = await Payment.create(
			[
				{
					booking: booking[0]._id,
					amount,
					transactionId,
				},
			],
			{ session }
		);

		const updateBooking = await Booking.findByIdAndUpdate(
			booking[0].id,
			{ payment: payment[0].id },
			{ new: true, runValidators: true, session }
		)
			.populate("user", "name email phone address")
			.populate("tour", "title costFrom")
			.populate("payment");

		const ssl = await SSLServices.SSLPaymentInit({
			amount,
			transactionId,
			name: user.name,
			email: user.email,
			address: user.address,
			phoneNumber: user.phone,
		});

		await session.commitTransaction();
		session.endSession();

		return {
			paymentUrl: ssl.GatewayPageURL,
			booking: updateBooking,
		};
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		throw error;
	}
};
const getMyBookings = async (userId: string) => {
	const bookings = await Booking.find({ user: userId })
		.populate("tour", "title costFrom")
		.populate("payment");

	return bookings;
};
const getAllBookings = async () => {
	return {};
};
const getBookingById = async () => {
	return {};
};
const updateBookingStatus = async () => {
	return {};
};

export const BookingServices = {
	createBooking,
	getMyBookings,
	getAllBookings,
	getBookingById,
	updateBookingStatus,
};
