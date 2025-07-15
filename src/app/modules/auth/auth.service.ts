import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import {
	createNewAccessTokenWithRefreshToken,
	userTokens,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
	const { email, password } = payload;
	if (!email || !password) {
		throw new AppError(400, "Email and Password are required");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(404, "User not found");
	}

	const { password: hashedPass, ...restUser } = user.toObject();

	const isPasswordValid = await bcrypt.compare(
		password,
		hashedPass as string
	);
	if (!isPasswordValid) {
		throw new AppError(401, "Invalid password");
	}

	const accessToken = userTokens(user).accessToken;
	const refreshToken = userTokens(user).refreshToken;

	return {
		accessToken,
		refreshToken,
		user: restUser,
	};
};
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
	const isOldPasswordValid = await bcrypt.compare(
		passwords.oldPassword,
		user.password as string
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
	credentialsLogin,
	getNewAccessToken,
	resetPassword,
};
