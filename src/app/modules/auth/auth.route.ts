import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { loginZodSchema, resetPasswordZodSchema } from "./auth.validation";

const router = Router();

router.post(
	"/login",
	validateRequest(loginZodSchema),
	AuthControllers.credentialsLogin
);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.get("/logout", AuthControllers.logout);
router.patch(
	"/reset-password",
	checkAuth(...Object.values(UserRole)),
	validateRequest(resetPasswordZodSchema),
	AuthControllers.resetPassword
);
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
	const redirectTo = req.query.redirect || "/";

	passport.authenticate("google", {
		scope: ["profile", "email"],
		state: redirectTo as string,
	})(req, res, next);
});
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	AuthControllers.googleCallback
);

export const AuthRoutes = router;
