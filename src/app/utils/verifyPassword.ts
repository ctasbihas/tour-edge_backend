import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";

export const verifyPassword = async (email: string, password: string) => {
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		throw new Error("User not found");
	}
	if (!user.password) {
		throw new Error(
			"This account is linked to Google. Please use Google login."
		);
	}

	const isValidPassword = await bcrypt.compare(
		password,
		user.password as string
	);

	return {
		isValid: isValidPassword,
		password: !!user.password,
	};
};
