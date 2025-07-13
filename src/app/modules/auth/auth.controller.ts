import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req, res) => {
	const user = await AuthServices.credentialsLogin(req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User logged in successfully",
		data: user,
	});
});

export const AuthControllers = { credentialsLogin };
