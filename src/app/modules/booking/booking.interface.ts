import { Types } from "mongoose";

export enum BookingStatus {
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
	CONFIRMED = "CONFIRMED",
	COMPLETED = "COMPLETED",
}

export interface IBooking {
	tour: Types.ObjectId;
	user: Types.ObjectId;
	payment?: Types.ObjectId;
	guestCount: number;
	status: BookingStatus;
}
