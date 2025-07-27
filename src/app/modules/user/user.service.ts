import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, UserRole, UserStatus } from "./user.interface";
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
const getUserByEmail = async (email: string) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(404, "User not found");
	}
	if (user.userStatus !== UserStatus.ACTIVE) {
		throw new AppError(403, `User is ${user.userStatus}`);
	}

	return user;
};
const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const hashedPassword = await bcrypt.hash(
		password as string,
		Number(env.BCRYPT_SALT_ROUNDS)
	);
	const authProvider: IAuthProvider = {
		provider: "credentials",
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
const updateUser = async (
	userId: string,
	payload: Partial<IUser>,
	decodedToken: JwtPayload
) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (payload.role) {
		if ([UserRole.USER, UserRole.GUIDE].includes(decodedToken.role)) {
			throw new AppError(
				403,
				"You are not authorized to update user roles"
			);
		}

		if (decodedToken.role === UserRole.ADMIN) {
			if (payload.role === UserRole.SUPER_ADMIN) {
				throw new AppError(
					403,
					"You are not authorized to update user to super admin"
				);
			}
			if (user.role === UserRole.SUPER_ADMIN) {
				throw new AppError(
					403,
					"You are not authorized to update super admin user"
				);
			}
		}
	}
	if (payload.password) {
		payload.password = await bcrypt.hash(
			payload.password as string,
			Number(env.BCRYPT_SALT_ROUNDS)
		);
	}
	if (payload.isDeleted || payload.isVerified || payload.userStatus) {
		if ([UserRole.USER, UserRole.GUIDE].includes(decodedToken.role)) {
			throw new AppError(
				403,
				"You are not authorized to update user status or verification"
			);
		}
	}

	const updatedUser = await User.findByIdAndUpdate(userId, payload, {
		new: true,
		runValidators: true,
	});

	return updatedUser;
};

export const UserServices = {
	getAllUsers,
	getUserByEmail,
	createUser,
	updateUser,
};
