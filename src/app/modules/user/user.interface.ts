import { Types } from "mongoose";

export enum UserRole {
	SUPER_ADMIN = "SUPER_ADMIN",
	ADMIN = "ADMIN",
	USER = "USER",
	GUIDE = "GUIDE",
}
export interface IAuthProvider {
	provider: string;
	providerId: string;
}
export enum UserStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	BLOCKED = "BLOCKED",
}

export interface IUser {
	name: string;
	email: string;
	password?: string;
	role: UserRole;
	phone?: string;
	picture?: string;
	address?: string;
	isDeleted?: boolean;
	userStatus?: UserStatus;
	isVerified?: boolean;
	auths: IAuthProvider[];
	bookings?: Types.ObjectId[];
	guides?: Types.ObjectId[];
}
