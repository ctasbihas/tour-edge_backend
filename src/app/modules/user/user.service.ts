import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsers = async () => {
	const users = await User.find();
	const totalUsers = await User.countDocuments();
	return {
		data: users,
		meta: {
			total: totalUsers,
		},
	};
};
const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new AppError(409, "User already exists with this email");
	}

	const hashedPassword = await bcrypt.hash(password as string, 10);
	const authProvider: IAuthProvider = {
		provider: password ? "credentials" : "google",
		providerId: email as string,
	};

	const user = await User.create({
		...rest,
		email,
		password: hashedPassword,
		auths: authProvider,
	});
	return user;
};

export const UserServices = {
	createUser,
	getAllUsers,
};
