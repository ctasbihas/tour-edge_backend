import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest =
	(zodSchema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		req.body = await zodSchema.parseAsync(req.body);
		next(req.body);
	};

export default validateRequest;
