import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { UserRole } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...roles: Partial<UserRole>[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				throw new AppError(401, "Authorization token is required");
			}

			const tokenData = verifyToken(token, env.JWT_ACCESS_SECRET);
			if (!roles.includes(tokenData.role)) {
				throw new AppError(403, "Unauthorized access");
			}

			req.user = tokenData;
			next();
		} catch (err) {
			next(err);
		}
	};
};
