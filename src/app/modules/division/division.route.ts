import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";

const router = Router();

router.get("/", DivisionControllers.getDivisions);
router.post(
	"/create",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	DivisionControllers.createDivision
);

export const DivisionRoutes = router;
