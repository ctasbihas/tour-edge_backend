import { Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
	const loginData = await AuthServices.credentialsLogin(req.body);

	res.cookie("access_token", loginData.accessToken, {
		httpOnly: true,
		secure: false,
	});
	res.cookie("refresh_token", loginData.refreshToken, {
		httpOnly: true,
		secure: false,
	});

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User logged in successfully",
		data: loginData,
	});
});
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
	const token = req.cookies.refresh_token;

	if (!token) {
		throw new AppError(401, "Refresh token is required");
	}
	const user = await AuthServices.getNewAccessToken(token as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "New access token generated successfully",
		data: user,
	});
});

export const AuthControllers = { credentialsLogin, getNewAccessToken };
