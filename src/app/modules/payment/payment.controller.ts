import { Request, Response } from "express";
import { env } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
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
	await PaymentServices.fail(req.query as Record<string, string>);

	res.redirect(`${env.FRONTEND_URL}/payment/fail`);
});
const cancel = catchAsync(async (req: Request, res: Response) => {
	await PaymentServices.cancel(req.query as Record<string, string>);

	res.redirect(`${env.FRONTEND_URL}/payment/cancel`);
});

export const PaymentControllers = {
	success,
	fail,
	cancel,
};
