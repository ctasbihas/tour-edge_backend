import z from "zod";
import { BookingStatus } from "./booking.interface";

export const createBookingSchema = z.object({
	tour: z.string(),
	guestCount: z.number().int().positive().min(1).default(1),
});
export const updateBookingSchema = z.object({
	status: z.enum(Object.values(BookingStatus) as [string]),
});
