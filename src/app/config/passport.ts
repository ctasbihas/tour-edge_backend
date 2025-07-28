import passport from "passport";
import {
	Strategy as GoogleStrategy,
	Profile,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { UserRole, UserStatus } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyPassword } from "../utils/verifyPassword";
import { env } from "./env";

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email: string, password: string, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, {
						message:
							"User not found. Please register with this email.",
					});
				}
				const passwordInfo = await verifyPassword(user.email, password);
				if (!passwordInfo.password) {
					return done(null, false, {
						message:
							"This account is linked to Google. Please use Google login.",
					});
				}
				if (!passwordInfo.isValid) {
					return done(null, false, {
						message: "Invalid password",
					});
				}
				if (user.isDeleted) {
					return done(null, false, {
						message: "User account is suspended.",
					});
				}
				if (user.userStatus !== UserStatus.ACTIVE) {
					return done(null, false, {
						message: `This account is ${user.userStatus}. Please contact support.`,
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);
passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: env.GOOGLE_CALLBACK_URL,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			done: VerifyCallback
		) => {
			try {
				const email = profile.emails?.[0]?.value;
				if (!email) {
					return done(
						new Error("Email not found in profile"),
						false,
						{ message: "Email not found in profile" }
					);
				}

				const user = await User.findOne({ email });
				if (!user) {
					const newUser = await User.create({
						email,
						name: profile.displayName,
						role: UserRole.USER,
						picture: profile.photos?.[0]?.value,
						isVerified: true,
						auths: [
							{
								provider: "google",
								providerId: profile.id,
							},
						],
					});

					return done(null, newUser);
				} else {
					return done(null, user);
				}
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});
