import { Types } from "mongoose";

export enum BookingStatus {
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED",
}

export interface IBooking {
	tour: Types.ObjectId;
	user: Types.ObjectId;
	payment?: Types.ObjectId;
	guestCount: number;
	status: BookingStatus;
}
