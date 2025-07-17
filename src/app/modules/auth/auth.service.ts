import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { verifyPassword } from "../../utils/verifyPassword";
import { User } from "../user/user.model";

const getNewAccessToken = async (token: string) => {
	const newAccessToken = await createNewAccessTokenWithRefreshToken(token);

	return {
		accessToken: newAccessToken,
	};
};
const resetPassword = async (
	tokenInfo: JwtPayload,
	passwords: { oldPassword: string; newPassword: string }
) => {
	const user = await User.findById(tokenInfo._id);
	if (!user) {
		throw new AppError(404, "User not found");
	}
	const isOldPasswordValid = verifyPassword(
		user.email,
		passwords.oldPassword
	);
	if (!isOldPasswordValid) {
		throw new AppError(401, "Old password is incorrect");
	}
	const hashedNewPassword = await bcrypt.hash(
		passwords.newPassword,
		Number(env.BCRYPT_SALT_ROUNDS)
	);

	const updatedUser = await User.findByIdAndUpdate(
		user._id,
		{ password: hashedNewPassword },
		{ new: true }
	);

	return {
		message: "Password updated successfully",
		user: updatedUser ? updatedUser._id : null,
	};
};

export const AuthServices = {
	getNewAccessToken,
	resetPassword,
};
