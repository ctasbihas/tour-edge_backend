import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
	try {
		const user = await User.create(payload);

		return user;
	} catch (error) {
		console.error("Error creating user:", error);
		throw new Error("Internal Server Error");
	}
};

export const UserServices = {
	createUser,
};
