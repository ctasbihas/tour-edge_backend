import mongoose, { model } from "mongoose";
import { IAuthProvider, IUser, UserRole, UserStatus } from "./user.interface";

const authProviderSchema = new mongoose.Schema<IAuthProvider>(
	{
		provider: {
			type: String,
			required: true,
		},
		providerId: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
		versionKey: false,
	}
);

const userSchema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			required: true,
			enum: Object.values(UserRole),
			default: UserRole.USER,
		},
		phone: {
			type: String,
		},
		picture: {
			type: String,
		},
		address: {
			type: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		userStatus: {
			type: String,
			enum: Object.values(UserStatus),
			default: UserStatus.ACTIVE,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		auths: [authProviderSchema],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const User = model<IUser>("User", userSchema);
