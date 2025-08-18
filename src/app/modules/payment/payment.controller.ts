import { Request, Response } from "express";
import { env } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";

const success = catchAsync(async (req: Request, res: Response) => {
	await PaymentServices.success(req.query as Record<string, string>);

	res.redirect(`${env.FRONTEND_URL}/payment/success`);
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
