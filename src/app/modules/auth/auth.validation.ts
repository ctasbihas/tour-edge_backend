import { z } from "zod";

export const loginZodSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email format"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password cannot be empty"),
});

export const resetPasswordZodSchema = z.object({
	oldPassword: z
		.string({ required_error: "Old password is required" })
		.min(1, "Old password cannot be empty"),
	newPassword: z
		.string({ required_error: "New password is required" })
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
});
