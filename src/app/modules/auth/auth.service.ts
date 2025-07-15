import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt";
import { userTokens } from "../../utils/userTokens";
import { IUser, UserStatus } from "../user/user.interface";
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
	const userData = verifyToken(
		token,
		env.JWT_REFRESH_SECRET
	) as Partial<IUser>;
	const user = await User.findOne({ email: userData.email });
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

	const refreshToken = userTokens(user).refreshToken;

	return {
		refreshToken,
	};
};

export const AuthServices = { credentialsLogin, getNewAccessToken };
