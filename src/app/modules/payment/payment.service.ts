import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { SSLServices } from "../ssl/ssl.service";
import { IUser } from "../user/user.interface";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const success = async (query: Record<string, string>) => {
	const { transactionId } = query;
	const session = await Payment.startSession();
	session.startTransaction();

	try {
		const payment = await Payment.findOneAndUpdate(
			{ transactionId },
			{ status: PaymentStatus.PAID },
			{ new: true, session }
		);
		if (!payment) {
			throw new Error("Payment not found");
		}

		await Booking.findByIdAndUpdate(
			payment.booking,
			{
				status: BookingStatus.COMPLETED,
			},
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return {
			success: true,
			message: "Payment successful",
		};
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		console.log(error);
		throw error;
	}
};
const fail = async (query: Record<string, string>) => {
	const { transactionId } = query;
	const session = await Payment.startSession();
	session.startTransaction();

	try {
		const payment = await Payment.findOneAndUpdate(
			{ transactionId },
			{ status: PaymentStatus.FAILED },
			{ new: true, session }
		);
		if (!payment) {
			throw new Error("Payment not found");
		}

		await Booking.findByIdAndUpdate(
			payment.booking,
			{
				status: BookingStatus.FAILED,
			},
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return {
			success: false,
			message: "Payment failed",
		};
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		console.log(error);
		throw error;
	}
};
const cancel = async (query: Record<string, string>) => {
	const { transactionId } = query;
	const session = await Payment.startSession();
	session.startTransaction();

	try {
		const payment = await Payment.findOneAndUpdate(
			{ transactionId },
			{ status: PaymentStatus.CANCELLED },
			{ new: true, session }
		);
		if (!payment) {
			throw new Error("Payment not found");
		}

		await Booking.findByIdAndUpdate(
			payment.booking,
			{
				status: BookingStatus.CANCELLED,
			},
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return {
			success: false,
			message: "Payment cancelled",
		};
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		console.log(error);
		throw error;
	}
};
const initPayment = async (bookingId: string) => {
	const payment = await Payment.findOne({ booking: bookingId });
	const booking = await Booking.findById(bookingId).populate("user");
	if (!payment) {
		throw new AppError(404, "Payment not found");
	}
	if (!booking) {
		throw new AppError(404, "Booking not found");
	}
	const user = booking.user as unknown as IUser;

	const ssl = await SSLServices.SSLPaymentInit({
		amount: payment.amount,
		transactionId: payment.transactionId,
		name: user.name,
		email: user.email,
		address: user.address!,
		phoneNumber: user.phone!,
	});

	return {
		paymentURL: ssl.GatewayPageURL,
	};
};

export const PaymentServices = {
	success,
	fail,
	cancel,
	initPayment,
};
