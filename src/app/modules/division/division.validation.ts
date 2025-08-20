import z from "zod";

export const createDivisionZodSchema = z.object({
	name: z
		.string({ invalid_type_error: "Name must be a string!!" })
		.min(1, "Name is required")
		.max(50, "Name must be less than 50 characters"),
	thumbnail: z
		.string({ invalid_type_error: "Thumbnail must be a string!!" })
		.url("Invalid URL format for thumbnail"),
	description: z
		.string({ invalid_type_error: "Description must be a string!!" })
		.max(500, { message: "Description cannot exceed 500 characters." }),
});
export const updateDivisionZodSchema = z.object({
	name: z
		.string({ invalid_type_error: "Name must be a string!!" })
		.min(1, "Name is required")
		.max(50, "Name must be less than 50 characters")
		.optional(),
	thumbnail: z
		.string({ invalid_type_error: "Thumbnail must be a string!!" })
		.url("Invalid URL format for thumbnail")
		.optional(),
	description: z
		.string({ invalid_type_error: "Description must be a string!!" })
		.max(500, { message: "Description cannot exceed 500 characters." })
		.optional(),
});
