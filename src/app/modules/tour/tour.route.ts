import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import {
	createTourTypeZodSchema,
	createTourZodSchema,
	updateTourTypeZodSchema,
	updateTourZodSchema,
} from "./tour.validation";

const router = Router();

router.get(
	"/",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	TourControllers.getAllTours
);
router.get("/:slug", TourControllers.getTourBySlug);
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

// Tour Type Routes
router.get("/tour-types", TourControllers.getAllTourTypes);
router.post(
	"/create-tour-type",
	checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(createTourTypeZodSchema),
	TourControllers.createTourType
);
router.patch(
	"/tour-types/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateTourTypeZodSchema),
	TourControllers.updateTourType
);
router.delete(
	"/tour-types/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	TourControllers.deleteTourType
);

export const TourRoutes = router;
