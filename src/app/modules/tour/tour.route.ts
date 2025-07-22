import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = Router();

router.get(
	"/",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	TourControllers.getAllTours
);
router.post(
	"/create",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(createTourZodSchema),
	TourControllers.createTour
);
router.patch(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateTourZodSchema),
	TourControllers.updateTour
);
router.delete(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	TourControllers.deleteTour
);

export const TourRoutes = router;
