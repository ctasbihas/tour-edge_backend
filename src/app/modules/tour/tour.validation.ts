import { z } from "zod";

export const createTourZodSchema = z.object({
	title: z
		.string({
			required_error: "Title is required",
		})
		.min(1, "Title cannot be empty"),

	slug: z
		.string({
			required_error: "Slug is required",
		})
		.min(1, "Slug cannot be empty"),

	description: z.string().optional(),

	images: z.array(z.string().url("Invalid image URL")).optional(),

	location: z.string().optional(),

	costFrom: z.number().min(0, "Cost must be a positive number").optional(),

	startDate: z.string().datetime("Invalid start date format").optional(),

	endDate: z.string().datetime("Invalid end date format").optional(),

	included: z.array(z.string()).optional(),

	excluded: z.array(z.string()).optional(),

	amenities: z.array(z.string()).optional(),

	tourPlan: z.array(z.string()).optional(),

	maxGuest: z
		.number()
		.int()
		.min(1, "Max guest must be at least 1")
		.optional(),

	minAge: z.number().int().min(0, "Min age must be non-negative").optional(),

	division: z
		.string({
			required_error: "Division is required",
		})
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid division ObjectId"),

	tourType: z
		.string({
			required_error: "Tour type is required",
		})
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid tour type ObjectId"),
});
export const updateTourZodSchema = z.object({
	title: z.string().min(1, "Title cannot be empty").optional(),
	slug: z.string().min(1, "Slug cannot be empty").optional(),
	description: z.string().optional(),
	images: z.array(z.string().url("Invalid image URL")).optional(),
	location: z.string().optional(),
	costFrom: z.number().min(0, "Cost must be a positive number").optional(),
	startDate: z.string().datetime("Invalid start date format").optional(),
	endDate: z.string().datetime("Invalid end date format").optional(),
	included: z.array(z.string()).optional(),
	excluded: z.array(z.string()).optional(),
	amenities: z.array(z.string()).optional(),
	tourPlan: z.array(z.string()).optional(),
	maxGuest: z
		.number()
		.int()
		.min(1, "Max guest must be at least 1")
		.optional(),
	minAge: z.number().int().min(0, "Min age must be non-negative").optional(),
	division: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid division ObjectId")
		.optional(),
	tourType: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid tour type ObjectId")
		.optional(),
});

// This schema is used to validate the request body for creating a tour type
export const createTourTypeZodSchema = z.object({
	name: z
		.string({
			required_error: "Tour type name is required",
		})
		.min(1, "Tour type name cannot be empty"),
});
