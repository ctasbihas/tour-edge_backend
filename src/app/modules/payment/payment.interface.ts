import { Types } from "mongoose";

export enum PaymentStatus {
	PAID = "PAID",
	UNPAID = "UNPAID",
	CANCELLED = "CANCELLED",
	FAILED = "FAILED",
	REFUNDED = "REFUNDED",
}

export interface IPayment {
	booking: Types.ObjectId;
	transactionId: string;
	amount: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	paymentGatewayData?: any;
	invoiceUrl?: string;
	status: PaymentStatus;
}
