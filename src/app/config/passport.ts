import passport from "passport";
import {
	Strategy as GStrategy,
	Profile,
	VerifyCallback,
} from "passport-google-oauth20";
import { UserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { env } from "./env";

passport.use(
	new GStrategy(
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
