import bcrypt from "bcryptjs";
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

export const AuthServices = { credentialsLogin, getNewAccessToken };
