import { Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
	const loginData = await AuthServices.credentialsLogin(req.body);

	setAuthCookie(res, loginData);

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
	const tokenInfo = await AuthServices.getNewAccessToken(token as string);

	setAuthCookie(res, tokenInfo);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "New access token generated successfully",
		data: tokenInfo,
	});
});
const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("access_token", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});
	res.clearCookie("refresh_token", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User logged out successfully",
		data: null,
	});
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const passwords = req.body;
	const tokenInfo = req.user;
	const result = await AuthServices.resetPassword(tokenInfo, passwords);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: result.message,
		data: null,
	});
});

export const AuthControllers = {
	credentialsLogin,
	getNewAccessToken,
	logout,
	resetPassword,
};
