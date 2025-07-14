import { env } from "../config/env";
import { UserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { UserServices } from "../modules/user/user.service";

export const seedSuperAdmin = async () => {
	const superAdmin = await User.findOne({ email: env.SUPER_ADMIN_EMAIL });

	if (!superAdmin) {
		const user = await UserServices.createUser({
			name: "Super Admin",
			email: env.SUPER_ADMIN_EMAIL,
			password: env.SUPER_ADMIN_PASSWORD,
			role: UserRole.SUPER_ADMIN,
			isVerified: true,
		});

		console.log(user);
		console.log("Super Admin seeded successfully.");
	} else {
		console.log("Super Admin already exists.");
	}
};
