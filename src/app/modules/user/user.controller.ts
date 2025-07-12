import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const users = await UserServices.getAllUsers();

	res.status(200).json({
		success: true,
		message: "Users retrieved successfully",
		users,
	});
});
const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserServices.createUser(req.body);

	res.status(201).json({
		success: true,
		message: "User registered successfully",
		user,
	});
});

export const UserControllers = {
	createUser,
	getAllUsers,
};
