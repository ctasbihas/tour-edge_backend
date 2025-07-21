import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";
import {
	createDivisionZodSchema,
	updateDivisionZodSchema,
} from "./division.validation";

const router = Router();

router.get("/", DivisionControllers.getDivisions);
router.post(
	"/create",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(createDivisionZodSchema),
	DivisionControllers.createDivision
);
router.patch(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateDivisionZodSchema),
	DivisionControllers.updateDivision
);
router.delete(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	DivisionControllers.deleteDivision
);

export const DivisionRoutes = router;
