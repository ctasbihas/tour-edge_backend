/* eslint-disable no-unused-vars */

import type { NextFunction, Request, Response } from "express";

type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export const catchAsync = (callback: AsyncHandler) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(callback(req, res, next)).catch((err) => next(err));
	};
};
