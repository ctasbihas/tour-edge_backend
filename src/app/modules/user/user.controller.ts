import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { UserServices } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await UserServices.getAllUsers();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Users retrieved successfully",
		meta: {
			total: result.meta.total,
		},
		data: result.data,
	});
});
const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
	const email = req.params.email;
	const user = await UserServices.getUserByEmail(email);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User retrieved successfully",
		data: user,
	});
});
const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserServices.createUser(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "User created successfully",
		data: user,
	});
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;
	const payload = req.body;
	const decodedToken = req.user as JwtPayload;
	const user = await UserServices.updateUser(userId, payload, decodedToken);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User updated successfully",
		data: user,
	});
});

export const UserControllers = {
	getAllUsers,
	getUserByEmail,
	createUser,
	updateUser,
};
