import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { TourControllers } from "./tour.controller";

const router = Router();

router.get(
	"/",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	TourControllers.getAllTours
);

export const TourRoutes = router;
