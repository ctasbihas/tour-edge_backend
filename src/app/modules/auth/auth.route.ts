import { Router } from "express";
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

export const AuthRoutes = router;
