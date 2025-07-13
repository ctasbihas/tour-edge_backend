import z from "zod";

export const createUserZodSchema = z.object({
	name: z
		.string({ invalid_type_error: "Name must be a string!!" })
		.min(1, "Name is required")
		.max(50, "Name must be less than 50 characters"),
	email: z
		.string({ invalid_type_error: "Email must be a string!!" })
		.email("Invalid email format")
		.min(1, "Email is required")
		.max(100, "Email must be less than 100 characters"),
	password: z
		.string({ invalid_type_error: "Password must be a string!!" })
		.min(8, "Password must be at least 8 characters long")
		.regex(/^(?=.*[a-z])/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/^(?=.*[A-Z])/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/^(?=.*[!@#$%^&*()])/, {
			message:
				"Password must contain at least one special character (!@#$%^&*())",
		})
		.regex(/^(?=.*\d)/, {
			message: "Password must contain at least one number",
		}),
	phone: z
		.string({
			invalid_type_error: "Phone number must be a string!!",
		})
		.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
			message: "Invalid phone number format",
		})
		.optional(),
	address: z
		.string({ invalid_type_error: "Address must be a string!!" })
		.max(200, { message: "Address cannot exceed 200 characters." })
		.optional(),
});
