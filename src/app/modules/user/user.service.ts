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
	const existingUser = await User.findOne({
		email: payload.email,
	});
	if (existingUser) {
		throw new AppError(409, "User already exists with this email");
	}

	const authProvider: IAuthProvider = {
		provider: payload.password ? "credentials" : "google",
		providerId: payload.email as string,
	};

	const user = await User.create({
		...payload,
		auths: authProvider,
	});
	return user;
};

export const UserServices = {
	createUser,
	getAllUsers,
};
