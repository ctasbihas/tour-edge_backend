import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
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

	const isPasswordValid = await bcrypt.compare(
		password,
		user.password as string
	);
	if (!isPasswordValid) {
		throw new AppError(401, "Invalid password");
	}

	return {
		email: user.email,
	};
};

export const AuthServices = { credentialsLogin };
