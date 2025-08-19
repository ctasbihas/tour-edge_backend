import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest =
	(zodSchema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const body = JSON.parse(req.body.data) || req.body;
		req.body = await zodSchema.parseAsync(body);

		next();
	};

export default validateRequest;
