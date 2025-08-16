import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
	{
		booking: {
			type: Schema.Types.ObjectId,
			ref: "Booking",
			required: true,
			unique: true,
		},
		transactionId: {
			type: String,
			required: true,
			unique: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		paymentGatewayData: {
			type: Schema.Types.Mixed,
		},
		invoiceUrl: {
			type: String,
		},
		status: {
			type: String,
			enum: Object.values(PaymentStatus),
			default: PaymentStatus.UNPAID,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const Payment = model<IPayment>("Payment", paymentSchema);
