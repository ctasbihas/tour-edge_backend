import { NextFunction, Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		throw new AppError(400, "This is a custom error message");

		const user = await UserServices.createUser(req.body);

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			user,
		});
	} catch (error) {
		next(error);
	}
};

export const UserControllers = {
	createUser,
};
