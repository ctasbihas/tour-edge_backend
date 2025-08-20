import { v2 as cloudinary } from "cloudinary";
import AppError from "../errorHelpers/AppError";
import { env } from "./env";

cloudinary.config({
	cloud_name: env.CLOUDINARY.CLOUD_NAME,
	api_key: env.CLOUDINARY.API_KEY,
	api_secret: env.CLOUDINARY.API_SECRET,
});

export const deleteCloudinaryImage = async (url: string) => {
	try {
		const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
		const match = url.match(regex);
		if (!match) throw new Error("Invalid image URL");

		const publicId = match[1];
		await cloudinary.uploader.destroy(publicId);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw new AppError(
			500,
			"Failed to delete image from Cloudinary",
			error.message
		);
	}
};

export const cloudinaryUpload = cloudinary;
