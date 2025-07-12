import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await UserServices.getAllUsers();

		res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			users,
		});
	} catch (error) {
		next(error);
	}
};
const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
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
	getAllUsers,
};
