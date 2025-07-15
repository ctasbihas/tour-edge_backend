import { env } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const userTokens = (user: Partial<IUser>) => {
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
