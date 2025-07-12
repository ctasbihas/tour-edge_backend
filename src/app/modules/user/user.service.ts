import { IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsers = async () => {
	const users = await User.find();
	return users;
};
const createUser = async (payload: Partial<IUser>) => {
	const user = await User.create(payload);
	return user;
};

export const UserServices = {
	createUser,
	getAllUsers,
};
