import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
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
const cancel = (query: Record<string, string>) => {
	console.log(query);
};

export const PaymentServices = {
	success,
	fail,
	cancel,
};
