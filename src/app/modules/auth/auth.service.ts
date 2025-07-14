import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

	const accessToken = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		"process.env.JWT_SECRET as string",
		{
			expiresIn: "1h",
		}
	);

	return {
		accessToken,
	};
};

export const AuthServices = { credentialsLogin };
