import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
	cloudinary: cloudinaryUpload,
	params: {
		public_id: (req, file) => {
			const fileName = file.originalname
				.toLowerCase()
				.split(".")
				.slice(0, -1)
				.join("-")
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			const newFileName =
				Math.random().toString(36).substring(2) +
				"-" +
				Date.now() +
				"-" +
				fileName;

			return newFileName;
		},
	},
});

export const multerUpload = multer({ storage });
