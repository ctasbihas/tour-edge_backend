import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.get(
	"/",
	validateRequest(createUserZodSchema),
	UserControllers.getAllUsers
);
router.post("/register", UserControllers.createUser);

export const UserRoutes = router;
