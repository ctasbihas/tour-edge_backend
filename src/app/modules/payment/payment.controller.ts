import { Request, Response } from "express";
import { env } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { PaymentServices } from "./payment.service";

const success = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const frontendQuery = new URLSearchParams(query).toString();
	const result = await PaymentServices.success(query);

	if (result.success) {
		res.redirect(`${env.FRONTEND_URL}/payment/success?${frontendQuery}`);
	}
});
const fail = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const frontendQuery = new URLSearchParams(query).toString();
	const result = await PaymentServices.fail(query);

	if (!result.success) {
		res.redirect(`${env.FRONTEND_URL}/payment/fail?${frontendQuery}`);
	}
});
const cancel = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const frontendQuery = new URLSearchParams(query).toString();
	const result = await PaymentServices.cancel(query);

	if (!result.success) {
		res.redirect(`${env.FRONTEND_URL}/payment/cancel?${frontendQuery}`);
	}
});
const initPayment = catchAsync(async (req: Request, res: Response) => {
	const bookingId = req.params.bookingId;
	const result = await PaymentServices.initPayment(bookingId);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment done successfully",
		data: result,
	});
});

export const PaymentControllers = {
	success,
	fail,
	cancel,
	initPayment,
};
