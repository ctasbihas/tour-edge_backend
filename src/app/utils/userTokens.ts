import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IUser, UserStatus } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
	const payload = {
		_id: user._id,
		email: user.email,
		role: user.role,
	};

	const accessToken = generateToken(
		payload,
		env.JWT_ACCESS_SECRET,
		env.JWT_ACCESS_EXPIRES
	);
	const refreshToken = generateToken(
		payload,
		env.JWT_REFRESH_SECRET,
		env.JWT_REFRESH_EXPIRES
	);
	return {
		accessToken,
		refreshToken,
	};
};
export const createNewAccessTokenWithRefreshToken = async (
	refreshToken: string
) => {
	const { email } = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (
		user.userStatus === UserStatus.INACTIVE ||
		user.userStatus === UserStatus.BLOCKED
	) {
		throw new AppError(403, `User is ${user.userStatus}`);
	}
	if (user.isDeleted) {
		throw new AppError(404, "This user has been suspended.");
	}

	const accessToken = generateToken(
		{ _id: user._id, email: user.email, role: user.role },
		env.JWT_ACCESS_SECRET,
		env.JWT_ACCESS_EXPIRES
	);
	return accessToken;
};
