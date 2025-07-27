import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserRole } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.get(
	"/",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	UserControllers.getAllUsers
);
router.get(
	"/:email",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	UserControllers.getSingleUser
);
router.post(
	"/register",
	validateRequest(createUserZodSchema),
	UserControllers.createUser
);
router.patch(
	"/:id",
	checkAuth(...Object.values(UserRole)),
	UserControllers.updateUser
);

export const UserRoutes = router;
