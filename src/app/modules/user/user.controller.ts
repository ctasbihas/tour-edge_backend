import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { UserServices } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const result = await UserServices.getAllUsers(query);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Users retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
	const email = req.params.email;
	const user = await UserServices.getSingleUser(email);

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
	getSingleUser,
	createUser,
	updateUser,
};
